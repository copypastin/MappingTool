# wip



import numpy as np
import pandas as pd

import matplotlib as mpl
import matplotlib.pyplot as plt

import seaborn as sns
import seaborn.objects as so

from matplotlib.colors import LinearSegmentedColormap

def make_heatmap(coords_file, output_file, title='Player Locations (3/29 - Today)', cmap="inferno", dpi=500):
    # Load the coordinates from the CSV file
    coords = sns.load_dataset(coords_file)
    coords.columns = coords.columns.str.strip()

    # Ensure columns are numeric
    coords['x'] = pd.to_numeric(coords['x'], errors='coerce')
    coords['z'] = pd.to_numeric(coords['z'], errors='coerce')

    # Drop rows with NaN values
    coords = coords.dropna()
    print(f"Loaded {len(coords)} valid coordinates from {coords_file}")

    # Check if the required columns are present
    if 'x' not in coords.columns or 'z' not in coords.columns:
        raise ValueError("CSV file must contain 'x' and 'z' columns")

    sns.kdeplot(
        data = coords, x="x", y="z",
        fill=True, thresh=0, levels=100, cmap="mako",
    )

    sns.savefig("output.png")


make_heatmap('data/coords.csv', 'heatmap.png')