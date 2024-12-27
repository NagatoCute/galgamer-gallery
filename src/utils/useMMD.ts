import { useGLTF } from '@react-three/drei'
import type { GLTF } from 'three-stdlib'
import * as THREE from 'three'
import { useRef, useEffect, useState } from 'react'
import { useFrame, useLoader } from '@react-three/fiber'
import { MMDLoader } from 'three-stdlib'
import type { LoaderResult } from '@react-three/fiber'

export default function useMMD(url: string) {
  const mmd = useLoader(MMDLoader, url);

  type material = THREE.Material & { emissive: THREE.Color };

  useEffect(() => {
    for (const material of mmd.material as material[]) {
      material['emissive'].set(0x000000);
    }
  }, [mmd]);

  return mmd;
}