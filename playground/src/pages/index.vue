<script setup lang="ts">
import { sThree } from '../../../src/index'

let points: any
let unmount: any
let geometry
let material
const params = {
  count: 200,
  size: 0.008,
  radius: 4.5,
  insideColor: '#552fc4',
  outsideColor: '#000',
}
const { c, animationArray, THREE, scene, renderer } = sThree('#container', {
  createMesh() {
    generateGalaxy()
  },
  createCamera() {
    const camera = c('PC')
    camera.position.set(0, 0, 2)
    return camera
  },
  animate({ camera, elapsedTime, timestamp }) {
    animationArray[0].rotation.y = Math.sin(elapsedTime * 0.01) * 10
    animationArray[0].rotation.x = elapsedTime * 0.05
  },
})
function generateGalaxy() {
  if (points) {
    unmount?.()
    animationArray.shift()
  }
  geometry = c('bufferg')
  const { positions, colors } = getRandomColorPosition()
  geometry.setAttribute('position', c('ba', positions, 3))
  geometry.setAttribute('color', c('ba', colors, 3))
  // Material
  material = c('pm', {
    size: params.size,
    sizeAttenuation: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexColors: true,
  })
  points = c('p', geometry, material)
  unmount = scene._add?.(points)
  renderer.setClearColor(c('c', 'transparent'), 0)
  animationArray.push(points)
}
function getRandomColorPosition() {
  const positions = new Float32Array(params.count * 3)
  const colors = new Float32Array(params.count * 3)
  const colorInside = new THREE.Color(params.insideColor)
  const colorOutside = new THREE.Color(params.outsideColor)
  for (let i = 0; i < params.count; i++) {
    const i3 = i * 3
    // Position
    const radius = Math.random() * params.radius
    positions[i3 + 0] = (Math.random() - 0.5) * 3
    positions[i3 + 1] = (Math.random() - 0.5) * 3
    positions[i3 + 2] = (Math.random() - 0.5) * 3
    // Color
    const mixedColor = colorInside.clone()
    mixedColor.lerp(colorOutside, radius / params.radius)
    colors[i3 + 0] = mixedColor.r
    colors[i3 + 1] = mixedColor.g
    colors[i3 + 2] = mixedColor.b
  }
  return { colors, positions }
}
</script>

<template>
  <div id="container" fixed w-full h-full z--1 />
</template>
