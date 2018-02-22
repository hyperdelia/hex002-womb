import { Vector3 } from 'three';

export function objectToVector3(obj) {
  if (obj instanceof Vector3) {
    return obj;
  }

  return new Vector3(obj.x, obj.y, obj.z);
}
