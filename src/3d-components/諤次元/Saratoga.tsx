
import { useGLTF } from '@react-three/drei'
import type { GLTF } from 'three-stdlib'
import * as THREE from 'three'
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

export function Saratoga(
  props:
    { position: [number, number, number], rotationAngle: number }
) {
  type GLTFResult = GLTF & {
    nodes: {
      ['萨拉托加_加辅助骨分材质_半裙子物理修�']: THREE.Mesh
      ['萨拉托加_加辅助骨分材质_半裙子物理修�_1']: THREE.Mesh
      ['萨拉托加_加辅助骨分材质_半裙子物理修�_2']: THREE.Mesh
      ['萨拉托加_加辅助骨分材质_半裙子物理修�_3']: THREE.Mesh
      ['萨拉托加_加辅助骨分材质_半裙子物理修�_4']: THREE.Mesh
      ['萨拉托加_加辅助骨分材质_半裙子物理修�_5']: THREE.Mesh
      ['萨拉托加_加辅助骨分材质_半裙子物理修�_6']: THREE.Mesh
      ['萨拉托加_加辅助骨分材质_半裙子物理修�_7']: THREE.Mesh
    }
    materials: {
      ti: THREE.MeshStandardMaterial
      yiqun: THREE.MeshStandardMaterial
      fa: THREE.MeshStandardMaterial
      tou: THREE.MeshStandardMaterial
    }
  }
  const { nodes, materials } = useGLTF('/3D//丛雨.gltf') as GLTFResult
  return (
    <group {...props} dispose={null}>
      <group scale={5}>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes['萨拉托加_加辅助骨分材质_半裙子物理修�'].geometry}
          material={materials.ti}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes['萨拉托加_加辅助骨分材质_半裙子物理修�_1'].geometry}
          material={materials.ti}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes['萨拉托加_加辅助骨分材质_半裙子物理修�_2'].geometry}
          material={materials.yiqun}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes['萨拉托加_加辅助骨分材质_半裙子物理修�_3'].geometry}
          material={materials.yiqun}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes['萨拉托加_加辅助骨分材质_半裙子物理修�_4'].geometry}
          material={materials.yiqun}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes['萨拉托加_加辅助骨分材质_半裙子物理修�_5'].geometry}
          material={materials.fa}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes['萨拉托加_加辅助骨分材质_半裙子物理修�_6'].geometry}
          material={materials.tou}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes['萨拉托加_加辅助骨分材质_半裙子物理修�_7'].geometry}
          material={materials.ti}
        />
      </group>
    </group>
  )

}