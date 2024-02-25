<script setup lang="ts">
import type { Camera, Clock, Mesh, Quaternion, Renderer, Scene, Vector3 } from 'three';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import Globe from 'globe.gl';
fetch('/custom.geo.json').then(res => res.json()).then(countries => {
    const world = Globe()
        // .globeImageUrl('//unpkg.com/three-globe/example/img/earth-dark.jpg')
        .polygonsData(countries.features)
        .polygonCapColor(feat => '#040')
        .polygonAltitude(0.006)
        .polygonSideColor(() => 'rgba(0, 100, 0, 0)')
        .polygonCapColor(() => ['#1f5dc2', '#2c569c', '#2c429c', '#4560cc'][Math.round(Math.random() * 3)])
        .polygonStrokeColor(() => '#fff')
        (document.getElementById('globeViz'))

});
</script>

<template>
    <!-- <main></main> -->
    <div id="globeViz"></div>
</template>
