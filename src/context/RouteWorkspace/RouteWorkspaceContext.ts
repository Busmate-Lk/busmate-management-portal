import { createContext } from 'react';
import { RouteWorkspaceData, createEmptyRouteWorkspaceData, RouteGroup } from '@/types/RouteWorkspaceData';

export interface RouteWorkspaceContextType {
  data: RouteWorkspaceData;
  updateRouteGroup: (routeGroup: Partial<RouteGroup>) => void;
  updateFromYaml: (yaml: string) => void;
  getYaml: () => string;
}

export const RouteWorkspaceContext = createContext<RouteWorkspaceContextType>({
  data: createEmptyRouteWorkspaceData(),
  updateRouteGroup: () => {},
  updateFromYaml: () => {},
  getYaml: () => '',
});
