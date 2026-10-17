import { readFile } from "node:fs/promises";
import { Buffer } from "node:buffer";
import { test, expect, type Page } from "@playwright/test";

async function openDataAnalysis(page: Page) {
  await page.goto("/project/browser-check?name=Router%20%26%20CSV%20Check&field=computer-science");
  await expect(page.getByRole("heading", { name: "Router & CSV Check", exact: true })).toBeVisible();
  await page.getByRole("button", { name: /^Data Analysis/ }).click();
  await expect(page.getByRole("heading", { name: "DATA ANALYSIS", exact: true })).toBeVisible();
}

test("links, browser history and wildcard routes remain functional", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.goto("/login");
  await expect(page.getByRole("heading", { name: "Welcome Back!" })).toBeVisible();
  await page.getByRole("link", { name: "Sign up for free", exact: true }).click();
  await expect(page).toHaveURL(/\/signup$/);
  await expect(page.getByRole("heading", { name: "Create Account!" })).toBeVisible();
  await page.goBack();
  await expect(page.getByRole("heading", { name: "Welcome Back!" })).toBeVisible();
  await page.goto("/unknown/deep/path");
  await expect(page.getByRole("link", { name: /home/i })).toBeVisible();
  expect(errors).toEqual([]);
});

test("a workspace deep link opens real CSV calculations and exports their rows", async ({ page }) => {
  await openDataAnalysis(page);
  await page.locator('input[type="file"][accept=".csv"]').setInputFiles({
    name: "observations.csv", mimeType: "text/csv",
    buffer: Buffer.from('category,value,growth,target\n"first, group",10,1,8\nsecond,20,2,18\nthird,30,3,28\n'),
  });
  await expect(page.getByText("observations.csv · 3 rows", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: /^Regression/ }).click();
  await expect(page.getByText("value = 10.0000 × row index + (0.00000)", { exact: true })).toBeVisible();
  await expect(page.getByText("Prediction for x=4", { exact: true })).toBeVisible();
  await expect(page.getByText("40", { exact: true })).toBeVisible();
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export summary", exact: true }).click();
  const download = await downloadPromise;
  const path = await download.path();
  if (!path) throw new Error("Summary download did not produce a file");
  const exported = JSON.parse(await readFile(path, "utf8"));
  expect(exported.source).toBe("observations.csv");
  expect(exported.summary).toMatchObject({ count: 3, sum: 60, mean: 20 });
  expect(exported.rows.map((row: { value: number }) => row.value)).toEqual([10, 20, 30]);
  expect(exported.rows[0].category).toBe("first, group");
  await page.getByRole("button", { name: "AI Analysis", exact: true }).click();
  await expect(page.getByText("Calculated summary", { exact: true })).toBeVisible();
  await expect(page.getByText(/3 observations; mean 20/)).toBeVisible();
});

test("invalid CSV preserves the dataset and results; examples remain separate", async ({ page }) => {
  await openDataAnalysis(page);
  await page.getByRole("button", { name: /^Regression/ }).click();
  await expect(page.getByText("6,250", { exact: true })).toBeVisible();
  await page.locator('input[type="file"][accept=".csv"]').setInputFiles({
    name: "invalid.csv", mimeType: "text/csv",
    buffer: Buffer.from("category,value,growth,target\nbad,12kg,0,1\n"),
  });
  await expect(page.getByText(/must be a complete finite number/)).toBeVisible();
  await expect(page.getByText("Example dataset · 4 rows", { exact: true })).toBeVisible();
  await expect(page.getByText("6,250", { exact: true })).toBeVisible();
  const examples = page.locator("details").filter({ hasText: "Statistical examples — separate sample data" });
  await expect(examples).not.toHaveAttribute("open", "");
  await examples.locator("summary").click();
  await expect(examples.getByText(/They do not analyze the CSV imported above/)).toBeVisible();
});

test("compiled theme tokens, custom shadows and scoped chart colors retain their meaning", async ({ page }) => {
  await page.goto("/login");
  await expect(page.getByRole("heading", { name: "Welcome Back!" })).toBeVisible();
  const loadedFonts = await page.evaluate(async () => {
    const fonts = await Promise.all([
      document.fonts.load("16px Outfit"),
      document.fonts.load("16px Bangers"),
    ]);
    return fonts.map(faces => faces.length);
  });
  expect(loadedFonts.every(count => count > 0)).toBe(true);
  const styles = await page.evaluate(() => {
    const element = document.createElement("div");
    document.body.append(element);
    element.className = "brutal-card shadow-brutal border-3 rounded-sm";
    const card = getComputedStyle(element);
    const result = { border: card.borderTopWidth, radius: card.borderTopLeftRadius, shadow: card.boxShadow.replaceAll("rgba(0, 0, 0, 0) 0px 0px 0px 0px, ", ""), chartColor: "", width: "", nestedColor: "" };
    element.className = "border-2 border-[color:var(--color-border)]";
    element.style.setProperty("--color-border", "rgb(12, 34, 56)");
    result.chartColor = getComputedStyle(element).borderTopColor;
    element.className = "w-(--sidebar-width)";
    element.style.setProperty("--sidebar-width", "22rem");
    result.width = getComputedStyle(element).width;
    element.className = "bg-primary";
    element.style.setProperty("--primary", "210 100% 55%");
    result.nestedColor = getComputedStyle(element).backgroundColor;
    element.remove();
    return result;
  });
  expect(styles).toEqual({
    border: "3px", radius: "0px", shadow: "rgb(13, 13, 13) 6px 6px 0px 0px",
    chartColor: "rgb(12, 34, 56)", width: "352px", nestedColor: "rgb(26, 140, 255)",
  });
});

test("mobile form focus keeps the visible ring and forced-color outline", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/login");
  const email = page.getByLabel("Email", { exact: true });
  await email.focus();
  await expect(email).toHaveCSS("border-top-width", "1px");
  await expect(email).toHaveCSS("box-shadow", /rgb\(238, 43, 43\) 0px 0px 0px 4px/);
  await page.emulateMedia({ forcedColors: "active" });
  await expect(email).toHaveCSS("outline-style", "solid");
  await expect(email).toHaveCSS("outline-width", "2px");
  await expect(page.getByRole("button", { name: "Log In", exact: true })).toHaveCSS("cursor", "pointer");
});
