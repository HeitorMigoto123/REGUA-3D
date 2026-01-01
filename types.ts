
export type MeasurementMode = 'object' | 'person';

export interface Dimensions {
  width_cm: number;
  height_cm: number;
  depth_cm: number;
  object_name: string;
  explanation: string;
  mode: MeasurementMode;
}

export type AppStatus = 'idle' | 'camera' | 'analyzing' | 'result' | 'error';
