
import { useGLTF } from '@react-three/drei'
import type { GLTF } from 'three-stdlib'
import * as THREE from 'three'


export function MainBody(
  props: 
  { position: [number, number, number], rotationAngle: number }
) {
  type GLTFResult = GLTF & {
    nodes: {
      Mesh: THREE.Mesh
      Mesh_1: THREE.Mesh
      Mesh_2: THREE.Mesh
      Mesh_3: THREE.Mesh
    }
    materials: {}
  }
  const { nodes, materials } = useGLTF('/goupe/main-body.prt.gltf') as GLTFResult;
  return (
    <group {...props} dispose={null}>
      <group scale={0.1}>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Mesh.geometry}
          material={nodes.Mesh.material}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Mesh_1.geometry}
          material={nodes.Mesh_1.material}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Mesh_2.geometry}
          material={nodes.Mesh_2.material}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Mesh_3.geometry}
          material={nodes.Mesh_3.material}
        />
      </group>
    </group>
  )
}


export function TopCover(
  props: 
  { position: [number, number, number], rotationAngle: number }
) {
  type GLTFResult = GLTF & {
    nodes: {
      mesh_0: THREE.Mesh
      mesh_0_1: THREE.Mesh
      Mesh_1: THREE.Mesh
      Mesh_2: THREE.Mesh
      Mesh_3: THREE.Mesh
      Mesh_4: THREE.Mesh
      Mesh_5: THREE.Mesh
      Mesh_6: THREE.Mesh
    }
    materials: {}
  }
  const { nodes, materials } = useGLTF('/goupe//top-cover.prt.gltf') as GLTFResult;
  return (
    <group {...props} dispose={null}>
      <group scale={0.1}>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Mesh_1.geometry}
          material={nodes.Mesh_1.material}
        />
        <lineSegments geometry={nodes.Mesh_2.geometry} material={nodes.Mesh_2.material} />
        <lineSegments geometry={nodes.Mesh_3.geometry} material={nodes.Mesh_3.material} />
        <lineSegments geometry={nodes.Mesh_4.geometry} material={nodes.Mesh_4.material} />
        <lineSegments geometry={nodes.Mesh_5.geometry} material={nodes.Mesh_5.material} />
        <lineSegments geometry={nodes.Mesh_6.geometry} material={nodes.Mesh_6.material} />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.mesh_0.geometry}
          material={nodes.mesh_0.material}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.mesh_0_1.geometry}
          material={nodes.mesh_0_1.material}
        />
      </group>
    </group>
  )
}