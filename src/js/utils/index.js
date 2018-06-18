import { Vector3, Matrix4 } from 'three';

export function arrayToVector3(arr) {
  if (arr instanceof Vector3) {
    return arr;
  }

  return new Vector3(arr[0], arr[1], arr[2]);
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

export function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function randomRange(min, max) {
  return min + (Math.random() * (max - min));
}
