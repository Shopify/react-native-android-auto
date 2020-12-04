type HeaderAction = 'back' | 'app_icon';
type CarColor = 'blue' | 'green' | 'primary' | 'red' | 'secondary' | 'yellow' | 'default';

interface PlaceMetadata {
  type: 'place';
  latitude: number;
  longitude: number;
}

interface ActionStrip {
  actions: Omit<Action, 'type'>[];
}

type Metadata = PlaceMetadata;

interface CommonAttributes {
  key?: string | number;
}

interface Action extends CommonAttributes {
  type: 'action';
  title: string;
  backgroundColor?: CarColor;
  onPress?: (event: {}) => any;
}

interface Row extends CommonAttributes {
  type: 'row';
  title: string;
  texts?: string[];
  onPress?: (event: {}) => any;
  metadata?: Metadata | undefined;
}

interface ItemList extends CommonAttributes {
  type: 'item-list';
  header: string;
  children: Row[];
}

interface ListTemplate extends CommonAttributes {
  type: 'list-template';
  title: string;
  headerAction?: HeaderAction;
  isLoading?: boolean;
  actionStrip?: ActionStrip;
  children: ItemList[];
}

interface PlaceListMapTemplate extends CommonAttributes {
  type: 'place-list-map-template';
  title: string;
  headerAction?: HeaderAction;
  isLoading?: boolean;
  actionStrip?: ActionStrip;
  children: ItemList[];
}

interface PaneTemplate extends CommonAttributes {
  type: 'pane-template';
  title: string;
  headerAction?: HeaderAction;
  actionStrip?: ActionStrip;
  children: ItemList[];
}

interface Screen extends CommonAttributes {
  type: 'screen';
  name: string;
  render: (props?: any) => React.ReactElement<AndroidAutoTemplate>;
  children: AndroidAutoTemplate[] | AndroidAutoTemplate;
}

interface ScreenManager extends CommonAttributes {
  type: 'screen-manager';
  children: Screen[];
}

export type AndroidAutoTemplate = PaneTemplate | ListTemplate | PlaceListMapTemplate;

export type ExtractElementByType<Type extends AndroidAutoElement['type']> = Extract<AndroidAutoElement, {type: Type}>;
export type AndroidAutoElement = AndroidAutoTemplate | Row | ItemList | ScreenManager | Screen | Action;
export type ElementType = AndroidAutoElement['type'];
export interface Route {
  name: string;
  routeParams?: any;
  render?: React.FC;
}
export interface RootContainer {
  type: 'root-container';
  stack: Route[];
  prevStack: Route[];
  children?: AndroidAutoElement[];
}
