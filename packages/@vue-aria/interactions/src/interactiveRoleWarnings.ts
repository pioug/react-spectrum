import {isFocusable} from '@vue-aria/utils';
import {computed, unref, watch} from 'vue';
import type {FocusableElement, MaybeRef} from './types';

type WarningType = 'Focusable' | 'Pressable';

const FOCUSABLE_NATIVE_ELEMENTS = new Set([
  'button',
  'input',
  'select',
  'textarea',
  'a',
  'area',
  'summary',
  'img',
  'svg'
]);

const PRESSABLE_NATIVE_ELEMENTS = new Set([
  'button',
  'input',
  'select',
  'textarea',
  'a',
  'area',
  'summary'
]);

const FOCUSABLE_ROLES = new Set([
  'application',
  'button',
  'checkbox',
  'combobox',
  'gridcell',
  'img',
  'link',
  'menuitem',
  'menuitemcheckbox',
  'menuitemradio',
  'meter',
  'option',
  'progressbar',
  'radio',
  'searchbox',
  'separator',
  'slider',
  'spinbutton',
  'switch',
  'tab',
  'tabpanel',
  'textbox',
  'treeitem'
]);

const PRESSABLE_ROLES = new Set([
  'application',
  'button',
  'checkbox',
  'combobox',
  'gridcell',
  'link',
  'menuitem',
  'menuitemcheckbox',
  'menuitemradio',
  'option',
  'radio',
  'searchbox',
  'separator',
  'slider',
  'spinbutton',
  'switch',
  'tab',
  'textbox',
  'treeitem'
]);

function isDOMElement(element: unknown): element is Element {
  if (!element || typeof element !== 'object') {
    return false;
  }

  let ownerWindow = (element as Element).ownerDocument?.defaultView;
  if (!ownerWindow?.Element) {
    return false;
  }

  return element instanceof ownerWindow.Element;
}

function warnInteractiveRoleContract(
  warningType: WarningType,
  element: Element | null,
  isDisabled: boolean
): void {
  if (process.env.NODE_ENV === 'production') {
    return;
  }

  if (!isDOMElement(element)) {
    console.error(`<${warningType}> child must forward its ref to a DOM element.`);
    return;
  }

  if (!isDisabled && !isFocusable(element)) {
    console.warn(`<${warningType}> child must be focusable. Please ensure the tabIndex prop is passed through.`);
    return;
  }

  let nativeElements = warningType === 'Focusable'
    ? FOCUSABLE_NATIVE_ELEMENTS
    : PRESSABLE_NATIVE_ELEMENTS;
  if (nativeElements.has(element.localName)) {
    return;
  }

  let role = element.getAttribute('role');
  if (!role) {
    console.warn(`<${warningType}> child must have an interactive ARIA role.`);
    return;
  }

  let interactiveRoles = warningType === 'Focusable' ? FOCUSABLE_ROLES : PRESSABLE_ROLES;
  if (!interactiveRoles.has(role)) {
    console.warn(`<${warningType}> child must have an interactive ARIA role. Got "${role}".`);
  }
}

export function useFocusableRoleWarnings(
  elementRef?: MaybeRef<FocusableElement | null>,
  isDisabled?: MaybeRef<boolean>
): void {
  let element = computed(() => (elementRef == null ? null : unref(elementRef)));
  let disabled = computed(() => Boolean(unref(isDisabled)));

  watch([element, disabled], ([nextElement, nextDisabled]) => {
    warnInteractiveRoleContract('Focusable', nextElement, nextDisabled);
  }, {immediate: true});
}

export function usePressableRoleWarnings(
  elementRef?: MaybeRef<FocusableElement | null>,
  isDisabled?: MaybeRef<boolean>
): void {
  let element = computed(() => (elementRef == null ? null : unref(elementRef)));
  let disabled = computed(() => Boolean(unref(isDisabled)));

  watch([element, disabled], ([nextElement, nextDisabled]) => {
    warnInteractiveRoleContract('Pressable', nextElement, nextDisabled);
  }, {immediate: true});
}
