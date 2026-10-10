export interface TreeNode {
  id: string;
  type?: string;
  label: string;
  value?: string;
  leaf?: boolean;
  disabled?: boolean;
  hideCheckbox?: boolean;
  hasVibPoint?: boolean;
  data?: Record<string, unknown>;
  children?: TreeNode[];
}
