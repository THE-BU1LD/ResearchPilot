# football_graph.py
import numpy as np
import torch
import torch.nn as nn
import networkx as nx

from bokeh.plotting import figure, curdoc
from bokeh.models import (
    ColumnDataSource, LabelSet, HoverTool
)
from bokeh.layouts import column

# =========================
# FIELD CONSTANTS
# =========================
FIELD_X, FIELD_Y = 105, 68
GOAL_X = FIELD_X

# =========================
# ML MODEL
# =========================
class PassNet(nn.Module):
    def __init__(self):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(6, 32),
            nn.ReLU(),
            nn.Linear(32, 16),
            nn.ReLU(),
            nn.Linear(16, 1),
            nn.Sigmoid()
        )

    def forward(self, x):
        return self.net(x)

model = PassNet()

# =========================
# SYNTHETIC TRAINING DATA
# =========================
def generate_data(n=4000):
    X, y = [], []
    for _ in range(n):
        d = np.random.uniform(1, 40)
        angle = np.random.uniform(-np.pi, np.pi)
        pressure = np.random.uniform(0, 1)
        forward = np.random.uniform(0, 1)
        ball_dist = np.random.uniform(0, 30)
        zone = np.random.uniform(0, 1)

        success = (
            0.6 * np.exp(-d/30)
            + 0.2 * forward
            - 0.4 * pressure
            - 0.1 * abs(angle)
        )
        success = np.clip(success, 0, 1)

        X.append([d, angle, pressure, forward, ball_dist, zone])
        y.append([success])

    return torch.tensor(X, dtype=torch.float32), torch.tensor(y, dtype=torch.float32)

X, y = generate_data()
opt = torch.optim.Adam(model.parameters(), lr=0.01)
loss_fn = nn.BCELoss()

for _ in range(300):
    opt.zero_grad()
    loss = loss_fn(model(X), y)
    loss.backward()
    opt.step()

# =========================
# INITIAL POSITIONS
# =========================
players = np.array([
    [20, 34], [30, 50], [30, 18],
    [45, 60], [45, 34], [45, 8],
    [65, 50], [65, 18],
    [80, 40], [80, 28], [90, 34]
])
ball = np.array([[40, 34]])

# =========================
# BOKEH SOURCES
# =========================
player_src = ColumnDataSource(dict(
    x=players[:,0], y=players[:,1],
    name=[f"P{i+1}" for i in range(11)]
))
ball_src = ColumnDataSource(dict(x=ball[:,0], y=ball[:,1]))

edge_src = ColumnDataSource(dict(xs=[], ys=[], prob=[], color=[]))

# =========================
# GRAPH + ML LOGIC
# =========================
def update_graph():
    xs, ys, probs, colors = [], [], [], []
    G = nx.DiGraph()

    for i in range(11):
        for j in range(11):
            if i == j: continue

            p1 = np.array([player_src.data["x"][i], player_src.data["y"][i]])
            p2 = np.array([player_src.data["x"][j], player_src.data["y"][j]])

            d = np.linalg.norm(p2 - p1)
            angle = np.arctan2(p2[1]-p1[1], p2[0]-p1[0])
            forward = max(0, (p2[0]-p1[0]) / FIELD_X)
            pressure = 0.0
            ball_dist = np.linalg.norm(p1 - ball_src.data["x"][0:2])
            zone = p2[0] / FIELD_X

            feat = torch.tensor([[d, angle, pressure, forward, ball_dist, zone]])
            prob = model(feat).item()

            G.add_edge(i, j, weight=-np.log(prob + 1e-6), prob=prob)

    for i in range(11):
        edges = sorted(G.out_edges(i, data=True), key=lambda e: e[2]["prob"], reverse=True)[:3]
        for _, j, data in edges:
            p1 = players[i]
            p2 = players[j]

            xs.append([p1[0], p2[0]])
            ys.append([p1[1], p2[1]])
            probs.append(data["prob"])

            if data["prob"] > 0.6:
                colors.append("green")
            elif data["prob"] > 0.35:
                colors.append("orange")
            else:
                colors.append("red")

    edge_src.data = dict(xs=xs, ys=ys, prob=probs, color=colors)

update_graph()

# =========================
# PLOT
# =========================
p = figure(
    width=900, height=550,
    x_range=(0, FIELD_X), y_range=(0, FIELD_Y),
    title="11v0 Attacking Graph (ML + Graph Theory)",
    tools="pan,wheel_zoom,reset"
)

p.rect(x=FIELD_X/2, y=FIELD_Y/2, width=FIELD_X, height=FIELD_Y,
       fill_color="#2ecc71", line_color="white")

p.multi_line("xs", "ys", line_width=3, color="color", source=edge_src)

p.circle("x", "y", size=14, color="red", source=player_src)
p.circle("x", "y", size=10, color="gold", source=ball_src)

labels = LabelSet(x="x", y="y", text="name",
                  source=player_src, y_offset=8)
p.add_layout(labels)

p.add_tools(HoverTool(
    tooltips=[("Pass Success", "@prob")]
))

player_src.on_change("data", lambda a,b,c: update_graph())
ball_src.on_change("data", lambda a,b,c: update_graph())

curdoc().add_root(column(p))
