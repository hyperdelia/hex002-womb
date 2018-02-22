import { Vector3, Matrix4 } from 'three';

export function objectToVector3(obj) {
  if (obj instanceof Vector3) {
    return obj;
  }

  return new Vector3(obj.x, obj.y, obj.z);
}

export function normalizeDimension(roomSize, obj) {
  const halfRoomSize = roomSize / 2;

  if (obj instanceof Matrix4) {
    obj.setPosition(new Vector3(
      obj.elements[12] / halfRoomSize,
      obj.elements[13] / halfRoomSize,
      obj.elements[14] / halfRoomSize
    ));

    return obj;
  }

  return new Vector3(
    obj.x / halfRoomSize,
    obj.y / halfRoomSize,
    obj.z / halfRoomSize
  );
}
