import numpy as np
import pandas as pd

import matplotlib as mpl
import matplotlib.pyplot as plt

import seaborn as sns
import seaborn.objects as so

from matplotlib.colors import LinearSegmentedColormap

TARGET = "UpcastRumble"

#list cmap options: 'viridis', 'plasma', 'inferno', 'magma', 'cividis', 'black_to_red'
def make_heatmap(coords_file, output_file, title=f'{TARGET} Movements', cmap="inferno", dpi=500):
    # Load the coordinates from the CSV file
    coords = pd.read_csv(coords_file)
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

    # Create a 2D histogram (heatmap)
    heatmap, xedges, yedges = np.histogram2d(coords['x'], coords['z'], bins=150, range=[[-19000, 19000], [-9000, 9000]])

    # Define the extent of the heatmap
    extent = [xedges[0], xedges[-1], yedges[0], yedges[-1]]

    heatmap = np.clip(heatmap, 0, 4)  # cap the values at 100 to avoid extreme values dominating the color scale

    # Plotting
    plt.figure(figsize=(8, 3.15))
    plt.imshow(heatmap.T, extent=extent, origin='lower', cmap=cmap, aspect='auto', interpolation='nearest')
    plt.colorbar(label='Counts')
    plt.title(title)
    plt.xlabel('X Coordinate')
    plt.ylabel('Z Coordinate')
    plt.gca().invert_yaxis()    

    # Save the heatmap as a PNG file
    plt.savefig(output_file, dpi=dpi)
    plt.close()

make_heatmap(f'data/{TARGET}coords.csv', f'{TARGET}heatmap.png')