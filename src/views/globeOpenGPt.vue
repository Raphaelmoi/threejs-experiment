<template></template>
<script  lang="ts">
import Vue from 'vue';
import Globe from 'globe.gl';

// Create a new Vue.js application
const app = new Vue({
    el: '#app',
    data: {
        // Define the data to be used by the application
        worldData: null,
        points: []
    },
    // Use the 'mounted' hook to initialize the globe.gl library
    mounted() {
        // Create a new instance of the Globe class
        this.globe = new Globe();

        // Load the world data and set it as the globe's data source
        fetch('https://unpkg.com/world-atlas@1/world/110m.json')
            .then(response => response.json())
            .then(worldData => {
                this.worldData = worldData;
                this.globe.addData(worldData, { format: 'topojson' });
            });

        // Add a point to the globe
        this.points.push({
            name: 'New York City',
            coords: [40.7128, -74.0060]
        });

        // Render the globe and its points
        this.globe.createPoints();
        this.globe.animate();
    },
    // Use the 'beforeDestroy' hook to clean up the globe.gl instance
    beforeDestroy() {
        this.globe.destroy();
    }
});
</script>