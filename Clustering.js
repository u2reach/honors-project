

// Load pre-processed data 
const preProcessedData = require('./Data');

// K-means clustering function
function kMeansClustering(data, k, maxIterations) {
    // Initialize centroids randomly
    let centroids = initializeCentroids(data, k);
    let oldCentroids = centroids.map(centroid => [...centroid]); 
    let iterations = 0;

    while (iterations < maxIterations) {
        const clusters = assignDataToClusters(data, centroids);

        // Calculate new centroids
        centroids = calculateNewCentroids(data, clusters, k);

        // Check for convergence (if centroids have not changed)
        let converged = true;
        for (let i = 0; i < k; i++) {
            if (!oldCentroids[i].every((val, index) => val === centroids[i][index])) {
                converged = false;
                break;
            }
        }

        if (converged) {
            break; // Centroids have converged, exit loop
        }

        oldCentroids = centroids.map(centroid => [...centroid]); // Update old centroids
        iterations++;
    }

    return { clusters, centroids };
}

// Initialize centroids randomly
function initializeCentroids(data, k) {
    const centroids = [];
    for (let i = 0; i < k; i++) {
        const randomIndex = Math.floor(Math.random() * data.length);
        centroids.push(data[randomIndex]);
    }
    return centroids;
}

// Assign data points to clusters based on centroids
function assignDataToClusters(data, centroids) {
    const clusters = new Array(centroids.length).fill().map(() => []);
    for (const point of data) {
        const distances = centroids.map(centroid => calculateDistance(point, centroid));
        const minDistanceIndex = distances.indexOf(Math.min(...distances));
        clusters[minDistanceIndex].push(point);
    }
    return clusters;
}

// Calculate new centroids based on assigned clusters
function calculateNewCentroids(data, clusters, k) {
    const centroids = [];
    for (let i = 0; i < k; i++) {
        if (clusters[i].length > 0) {
            const clusterPoints = clusters[i];
            const clusterCenter = clusterPoints.reduce((acc, val) => acc.map((el, index) => el + val[index]), new Array(clusterPoints[0].length).fill(0));
            centroids.push(clusterCenter.map(val => val / clusterPoints.length));
        } else {
            centroids.push(new Array(data[0].length).fill(0)); // Handle empty clusters
        }
    }
    return centroids;
}


// Set parameters
const k = 3; // Number of clusters
const maxIterations = 100; // Maximum number of iterations

// Perform k-means clustering on pre-processed data
const { clusters, centroids } = kMeansClustering(preProcessedData, k, maxIterations);

// Output clusters and centroids
console.log('Clusters:', clusters);
console.log('Centroids:', centroids);
//
