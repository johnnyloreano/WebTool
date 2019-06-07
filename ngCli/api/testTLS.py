from pylab import imread
from stl_tools import numpy2stl
from scipy.ndimage import gaussian_filter
A = 256 * imread("img/chart.png")
A = A[:, :, 2] + 1.0*A[:,:, 0] # Compose RGBA channels to give depth
A = gaussian_filter(A, 1)  # smoothing
numpy2stl(A, "img/chartss.stl", scale=0.05, mask_val=5., solid=True)
