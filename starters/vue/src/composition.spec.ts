import {mount} from '@vue/test-utils';
import {computed, defineComponent, effectScope, h, nextTick, reactive, ref} from 'vue';
import {describe, expect, it, vi} from 'vitest';
import {useActionGroup, useActionGroupItem} from '@vue-aria/actiongroup';
import {useAutocomplete, useSearchAutocomplete} from '@vue-aria/autocomplete';
import {watchModals} from '@vue-aria/aria-modal-polyfill';
import {useBreadcrumbItem, useBreadcrumbs} from '@vue-aria/breadcrumbs';
import {useButton, useToggleButton, useToggleButtonGroup, useToggleButtonGroupItem} from '@vue-aria/button';
import {useCalendar, useCalendarCell, useCalendarGrid, useRangeCalendar} from '@vue-aria/calendar';
import {useCheckbox, useCheckboxGroup, useCheckboxGroupItem} from '@vue-aria/checkbox';
import {CollectionBuilder, useCachedChildren} from '@vue-aria/collections';
import {useComboBox} from '@vue-aria/combobox';
import {useColorArea, useColorChannelField, useColorField, useColorSlider, useColorSwatch, useColorWheel} from '@vue-aria/color';
import {useDateField, useDatePicker, useDateRangePicker, useTimeField} from '@vue-aria/datepicker';
import {useDialog as useAriaDialog} from '@vue-aria/dialog';
import {useDisclosure as useAriaDisclosure} from '@vue-aria/disclosure';
import {useDrag, useDrop} from '@vue-aria/dnd';
import {EXAMPLE_THEME_CLASS, useExampleTheme} from '@vue-aria/example-theme';
import {useFocusRing, useHasTabbableChild} from '@vue-aria/focus';
import {useFormValidation} from '@vue-aria/form';
import {
  GridKeyboardDelegate,
  useGrid,
  useGridCell,
  useGridRow,
  useGridRowGroup,
  useGridSelectionAnnouncement,
  useGridSelectionCheckbox,
  useHighlightSelectionDescription
} from '@vue-aria/grid';
import {
  useGridList,
  useGridListItem,
  useGridListSection,
  useGridListSelectionCheckbox
} from '@vue-aria/gridlist';
import {
  I18nProvider,
  isRTL,
  useCollator,
  useDateFormatter,
  useDefaultLocale,
  useFilter,
  useListFormatter,
  useLocale,
  useLocalizedStringFormatter,
  useMessageFormatter,
  useNumberFormatter
} from '@vue-aria/i18n';
import {useField, useLabel} from '@vue-aria/label';
import {UNSTABLE_createLandmarkController, useLandmark} from '@vue-aria/landmark';
import {useLink as useAriaLink} from '@vue-aria/link';
import {getItemId, listData, useListBox as useAriaListBox, useListBoxSection as useAriaListBoxSection, useOption as useAriaOption} from '@vue-aria/listbox';
import {announce, clearAnnouncer, destroyAnnouncer} from '@vue-aria/live-announcer';
import {useMenu as useAriaMenu, useMenuItem as useAriaMenuItem, useMenuSection, useMenuTrigger, useSubmenuTrigger} from '@vue-aria/menu';
import {useMeter as useAriaMeter} from '@vue-aria/meter';
import {useNumberField as useAriaNumberField} from '@vue-aria/numberfield';
import {
  ariaHideOutside as ariaHideOutsideOverlays,
  useModalOverlay as useAriaModalOverlay,
  useOverlay as useAriaOverlay,
  useOverlayPosition as useAriaOverlayPosition,
  useOverlayTrigger as useAriaOverlayTrigger,
  usePopover as useAriaPopover,
  usePreventScroll as useAriaPreventScroll
} from '@vue-aria/overlays';
import {useProgressBar as useAriaProgressBar} from '@vue-aria/progress';
import {useRadio as useAriaRadio, useRadioGroup as useAriaRadioGroup} from '@vue-aria/radio';
import {useSearchField as useAriaSearchField} from '@vue-aria/searchfield';
import {useHiddenSelect as useAriaHiddenSelect, useSelect as useAriaSelect} from '@vue-aria/select';
import {
  ListKeyboardDelegate as VueListKeyboardDelegate,
  useSelectableCollection as useAriaSelectableCollection,
  useSelectableItem as useAriaSelectableItem,
  useSelectableList as useAriaSelectableList,
  useTypeSelect as useAriaTypeSelect
} from '@vue-aria/selection';
import {useSeparator as useAriaSeparator} from '@vue-aria/separator';
import {useSlider as useAriaSlider, useSliderThumb as useAriaSliderThumb} from '@vue-aria/slider';
import {useSpinButton as useAriaSpinButton} from '@vue-aria/spinbutton';
import {SSRProvider as AriaSSRProvider, useIsSSR as useAriaIsSSR, useSSRSafeId as useAriaSSRSafeId} from '@vue-aria/ssr';
import {useStepList as useAriaStepList, useStepListItem as useAriaStepListItem} from '@vue-aria/steplist';
import {useSwitch as useAriaSwitch} from '@vue-aria/switch';
import {useTag as useAriaTag, useTagGroup as useAriaTagGroup} from '@vue-aria/tag';
import {useTab as useAriaTab, useTabList as useAriaTabList, useTabPanel as useAriaTabPanel} from '@vue-aria/tabs';
import {pointerMap as vueAriaPointerMap, triggerLongPress as triggerVueAriaLongPress, User as VueAriaUser} from '@vue-aria/test-utils';
import {useFormattedTextField as useAriaFormattedTextField, useTextField as useAriaTextField} from '@vue-aria/textfield';
import {useToast as useAriaToast, useToastRegion as useAriaToastRegion} from '@vue-aria/toast';
import {useToggle as useAriaToggle} from '@vue-aria/toggle';
import {useToolbar as useAriaToolbar} from '@vue-aria/toolbar';
import {useTooltip as useAriaTooltip, useTooltipTrigger as useAriaTooltipTrigger} from '@vue-aria/tooltip';
import {useTree as useAriaTree, useTreeItem as useAriaTreeItem} from '@vue-aria/tree';
import {
  chain as ariaChain,
  filterDOMProps as ariaFilterDOMProps,
  getActiveElement as ariaGetActiveElement,
  getEventTarget as ariaGetEventTarget,
  isFocusable as ariaIsFocusable,
  isFocusWithin as ariaIsFocusWithin,
  isTabbable as ariaIsTabbable,
  mergeIds as ariaMergeIds,
  mergeProps as ariaMergeProps,
  nodeContains as ariaNodeContains,
  useDrag1D as useAriaDrag1D,
  useId as useAriaId,
  useLabels as useAriaLabels,
  useSlotId as useAriaSlotId
} from '@vue-aria/utils';
import {
  ScrollView as AriaVirtualizerScrollView,
  Virtualizer as AriaVirtualizer,
  VirtualizerItem as AriaVirtualizerItem,
  getRTLOffsetType as getAriaRTLOffsetType,
  getScrollLeft as getAriaScrollLeft,
  layoutInfoToStyle as ariaLayoutInfoToStyle,
  setScrollLeft as setAriaScrollLeft,
  useScrollView as useAriaScrollView,
  useVirtualizer as useAriaVirtualizer,
  useVirtualizerItem as useAriaVirtualizerItem
} from '@vue-aria/virtualizer';
import {VISUALLY_HIDDEN_STYLES as ARIA_VISUALLY_HIDDEN_STYLES, useVisuallyHidden as useAriaVisuallyHidden} from '@vue-aria/visually-hidden';
import {
  useTable as useAriaTable,
  useTableCell as useAriaTableCell,
  useTableColumnHeader as useAriaTableColumnHeader,
  useTableColumnResize as useAriaTableColumnResize,
  useTableHeaderRow as useAriaTableHeaderRow,
  useTableRow as useAriaTableRow,
  useTableRowGroup as useAriaTableRowGroup,
  useTableSelectAllCheckbox as useAriaTableSelectAllCheckbox,
  useTableSelectionCheckbox as useAriaTableSelectionCheckbox
} from '@vue-aria/table';
import {
  addWindowFocusTracking,
  ClearPressResponder,
  disableTextSelection,
  Focusable,
  FocusableProvider,
  focusSafely,
  Pressable,
  PressResponder,
  restoreTextSelection,
  setInteractionModality,
  useFocus,
  useFocusable,
  useFocusVisible,
  useFocusWithin,
  useHover,
  useInteractOutside,
  useInteractionModality,
  useKeyboard,
  useLongPress,
  useMove,
  usePress,
  useScrollWheel
} from '@vue-aria/interactions';
import {Accordion, Disclosure, DisclosurePanel, DisclosureTitle} from '@vue-spectrum/accordion';
import {ActionBar} from '@vue-spectrum/actionbar';
import {ActionGroup} from '@vue-spectrum/actiongroup';
import {SearchAutocomplete} from '@vue-spectrum/autocomplete';
import {Breadcrumbs} from '@vue-spectrum/breadcrumbs';
import {ContextualHelp} from '@vue-spectrum/contextualhelp';
import {Dialog, useDialogContainer} from '@vue-spectrum/dialog';
import {ListView} from '@vue-spectrum/list';
import {Menu} from '@vue-spectrum/menu';
import {Popover} from '@vue-spectrum/overlays';
import {VueButton, VueSpectrumPlugin, VueSpectrumProvider, VueTextField, VueTree} from 'vue-aria-components';
import {Button as S2Button, Provider as S2Provider, Spectrum2Plugin, TextField as S2TextField, TreeView as S2TreeView} from '@vue-spectrum/s2';
import {baseColor as baseS1Color, focusRing as s1FocusRing, keyframes as s1Keyframes, lightDark as s1LightDark, raw as s1Raw, style as s1Style} from '@vue-spectrum/style-macro-s1';
import {ErrorBoundary as StoryUtilsErrorBoundary, generatePowerset as generateStoryPowerset} from '@vue-spectrum/story-utils';
import {pointerMap as spectrumPointerMap, simulateDesktop as simulateSpectrumDesktop, simulateMobile as simulateSpectrumMobile} from '@vue-spectrum/test-utils';
import {theme as darkTheme} from '@vue-spectrum/theme-dark';
import {theme as defaultTheme} from '@vue-spectrum/theme-default';
import {theme as expressTheme} from '@vue-spectrum/theme-express';
import {theme as lightTheme} from '@vue-spectrum/theme-light';
import {
  classNames as spectrumClassNames,
  createDOMRef as createSpectrumDOMRef,
  keepSpectrumClassNames as keepSpectrumClasses,
  shouldKeepSpectrumClassNames as shouldKeepSpectrumClasses,
  unwrapDOMRef as unwrapSpectrumDOMRef,
  useDOMRef as useSpectrumDOMRef,
  useIsMobileDevice as useSpectrumIsMobileDevice,
  useMediaQuery as useSpectrumMediaQuery,
  useStyleProps as useSpectrumStyleProps
} from '@vue-spectrum/utils';
import {useAutocompleteState as useStatelyAutocompleteState} from '@vue-stately/autocomplete';
import {useCalendarState as useStatelyCalendarState, useRangeCalendarState as useStatelyRangeCalendarState} from '@vue-stately/calendar';
import {useCheckboxGroupState as useStatelyCheckboxGroupState} from '@vue-stately/checkbox';
import {useComboBoxState as useStatelyComboBoxState} from '@vue-stately/combobox';
import {
  compareNodeOrder as compareStatelyNodeOrder,
  getChildNodes as getStatelyChildNodes,
  getFirstItem as getFirstStatelyItem,
  getItemCount as getStatelyItemCount,
  getLastItem as getLastStatelyItem,
  getNthItem as getNthStatelyItem,
  useCollection as useStatelyCollection
} from '@vue-stately/collections';
import {
  parseColor as parseStatelyColor,
  useColorAreaState as useStatelyColorAreaState,
  useColorChannelFieldState as useStatelyColorChannelFieldState,
  useColorFieldState as useStatelyColorFieldState,
  useColorPickerState as useStatelyColorPickerState,
  useColorWheelState as useStatelyColorWheelState,
  useColorSliderState as useStatelyColorSliderState
} from '@vue-stately/color';
import {useAsyncList as useStatelyAsyncList, useListData as useStatelyListData, useTreeData as useStatelyTreeData} from '@vue-stately/data';
import {
  useDateFieldState as useStatelyDateFieldState,
  useDatePickerState as useStatelyDatePickerState,
  useDateRangePickerState as useStatelyDateRangePickerState,
  useTimeFieldState as useStatelyTimeFieldState
} from '@vue-stately/datepicker';
import {useDisclosureGroupState as useStatelyDisclosureGroupState, useDisclosureState as useStatelyDisclosureState} from '@vue-stately/disclosure';
import {useDraggableCollectionState as useStatelyDraggableCollectionState, useDroppableCollectionState as useStatelyDroppableCollectionState} from '@vue-stately/dnd';
import {
  enableShadowDOM as enableStatelyShadowDOM,
  enableTableNestedRows as enableStatelyTableNestedRows,
  shadowDOM as statelyShadowDOM,
  tableNestedRows as statelyTableNestedRows
} from '@vue-stately/flags';
import {
  DEFAULT_VALIDATION_RESULT as DEFAULT_STATELY_VALIDATION_RESULT,
  mergeValidation as mergeStatelyValidation,
  useFormValidationState as useStatelyFormValidationState
} from '@vue-stately/form';
import {GridCollection as StatelyGridCollection, useGridState as useStatelyGridState} from '@vue-stately/grid';
import {
  GridLayout as StatelyGridLayout,
  ListLayout as StatelyListLayout,
  TableLayout as StatelyTableLayout,
  WaterfallLayout as StatelyWaterfallLayout
} from '@vue-stately/layout';
import {
  ListCollection as StatelyListCollection,
  type ListNode as StatelyListNode,
  UNSTABLE_useFilteredListState as useStatelyFilteredListState,
  useListState as useStatelyListState,
  useSingleSelectListState as useStatelySingleSelectListState
} from '@vue-stately/list';
import {useMenuTriggerState as useStatelyMenuTriggerState, useSubmenuTriggerState as useStatelySubmenuTriggerState} from '@vue-stately/menu';
import {useNumberFieldState as useStatelyNumberFieldState} from '@vue-stately/numberfield';
import {useOverlayTriggerState as useStatelyOverlayTriggerState} from '@vue-stately/overlays';
import {useRadioGroupState as useStatelyRadioGroupState} from '@vue-stately/radio';
import {useSearchFieldState as useStatelySearchFieldState} from '@vue-stately/searchfield';
import {
  Selection as StatelySelection,
  SelectionManager as StatelySelectionManager,
  useMultipleSelectionState as useStatelyMultipleSelectionState
} from '@vue-stately/selection';
import {useSelectState as useStatelySelectState} from '@vue-stately/select';
import {useSliderState as useStatelySliderState} from '@vue-stately/slider';
import {useStepListState as useStatelyStepListState} from '@vue-stately/steplist';
import {
  buildHeaderRows as buildStatelyTableHeaderRows,
  TableCollection as StatelyTableCollection,
  UNSTABLE_useFilteredTableState as useStatelyFilteredTableState,
  UNSTABLE_useTreeGridState as useStatelyTreeGridState,
  useTableState as useStatelyTableState
} from '@vue-stately/table';
import {useTabListState as useStatelyTabListState} from '@vue-stately/tabs';
import {
  ToastQueue as StatelyToastQueue,
  useToastQueue as useStatelyToastQueue,
  useToastState as useStatelyToastState
} from '@vue-stately/toast';
import {
  useToggleGroupState as useStatelyToggleGroupState,
  useToggleState as useStatelyToggleState
} from '@vue-stately/toggle';
import {useTooltipTriggerState as useStatelyTooltipTriggerState} from '@vue-stately/tooltip';
import {useTreeState as useStatelyTreeState} from '@vue-stately/tree';
import {
  clamp as clampStatelyNumber,
  roundToStepPrecision as roundStatelyStepPrecision,
  snapValueToStep as snapStatelyValueToStep,
  toFixedNumber as toStatelyFixedNumber,
  useControlledState as useStatelyControlledState
} from '@vue-stately/utils';
import {
  Layout as StatelyVirtualizerLayout,
  LayoutInfo as StatelyLayoutInfo,
  Point as StatelyVirtualizerPoint,
  Rect as StatelyVirtualizerRect,
  Size as StatelyVirtualizerSize,
  useVirtualizerState as useStatelyVirtualizerState
} from '@vue-stately/virtualizer';

function createPointerEvent(
  type: string,
  init: {button?: number, clientX?: number, clientY?: number, pageX?: number, pageY?: number, pointerId?: number, pointerType?: 'mouse' | 'pen' | 'touch'} = {}
): PointerEvent {
  if (typeof PointerEvent !== 'undefined') {
    return new PointerEvent(type, {
      bubbles: true,
      button: init.button ?? 0,
      clientX: init.clientX ?? init.pageX ?? 0,
      clientY: init.clientY ?? init.pageY ?? 0,
      pointerId: init.pointerId ?? 1,
      pointerType: init.pointerType ?? 'mouse'
    });
  }

  let event = new MouseEvent(type, {
    bubbles: true,
    button: init.button ?? 0,
    clientX: init.clientX ?? init.pageX ?? 0,
    clientY: init.clientY ?? init.pageY ?? 0
  }) as unknown as PointerEvent;
  Object.defineProperty(event, 'pointerId', {value: init.pointerId ?? 1});
  Object.defineProperty(event, 'pageX', {value: init.pageX ?? init.clientX ?? 0});
  Object.defineProperty(event, 'pageY', {value: init.pageY ?? init.clientY ?? 0});
  Object.defineProperty(event, 'pointerType', {value: init.pointerType ?? 'mouse'});
  return event;
}

function dispatchOutsideInteraction(target: EventTarget): void {
  if (typeof PointerEvent !== 'undefined') {
    target.dispatchEvent(createPointerEvent('pointerdown'));
    target.dispatchEvent(new MouseEvent('click', {bubbles: true}));
    return;
  }

  target.dispatchEvent(new MouseEvent('mousedown', {bubbles: true}));
  target.dispatchEvent(new MouseEvent('mouseup', {bubbles: true}));
}

function createDOMRect(left: number, top: number, width: number, height: number): DOMRect {
  return {
    x: left,
    y: top,
    width,
    height,
    top,
    left,
    right: left + width,
    bottom: top + height,
    toJSON: () => ({})
  } as DOMRect;
}

describe('Vue migration composition components', () => {
  it('computes next selection state for vue-aria action group composables', () => {
    let selectedKeys = ref(['Edit']);
    let actionGroup = useActionGroup({
      selectedKeys,
      selectionMode: ref('multiple')
    });
    let presses: Array<{key: string, selectedKeys: string[]}> = [];

    let item = useActionGroupItem({
      actionGroup,
      key: 'Delete',
      onPress: (key, nextSelectedKeys) => {
        presses.push({
          key,
          selectedKeys: Array.from(nextSelectedKeys)
        });
      }
    });

    expect(item.isSelected.value).toBe(false);
    expect(item.itemProps.value.role).toBe('menuitemcheckbox');
    item.press();
    expect(presses).toEqual([{key: 'Delete', selectedKeys: ['Edit', 'Delete']}]);
  });

  it('toggles aria-hidden when watched modal containers are added and removed', async () => {
    let previousMarkup = document.body.innerHTML;
    document.body.innerHTML = '<main data-testid=\"app-shell\"></main><div data-testid=\"portal-root\"></div>';

    try {
      let portalRoot = document.querySelector('[data-testid=\"portal-root\"]');
      let appShell = document.querySelector('[data-testid=\"app-shell\"]');

      if (!(portalRoot instanceof HTMLElement) || !(appShell instanceof HTMLElement)) {
        throw new Error('Expected portal and app shell nodes');
      }

      let stopWatching = watchModals('[data-testid=\"portal-root\"]', {document});
      let modalContainer = document.createElement('div');
      modalContainer.innerHTML = '<section aria-modal=\"true\"><p>Modal content</p></section>';

      portalRoot.append(modalContainer);
      await new Promise((resolve) => setTimeout(resolve, 0));
      expect(appShell.getAttribute('aria-hidden')).toBe('true');

      portalRoot.removeChild(modalContainer);
      await new Promise((resolve) => setTimeout(resolve, 0));
      expect(appShell.getAttribute('aria-hidden')).toBeNull();

      stopWatching();
    } finally {
      document.body.innerHTML = previousMarkup;
    }
  });

  it('filters autocomplete items and exposes focused key', () => {
    let inputValue = ref('vue');
    let autocomplete = useAutocomplete({
      inputValue,
      items: ['Vue', 'React', 'Svelte']
    });

    expect(autocomplete.filteredItems.value.map((item) => item.textValue)).toEqual(['Vue']);
    expect(autocomplete.focusedKey.value).toBe('Vue');

    inputValue.value = '';
    expect(autocomplete.filteredItems.value.map((item) => item.textValue)).toEqual(['Vue', 'React', 'Svelte']);
    expect(autocomplete.collectionProps.value.role).toBe('listbox');
    expect(autocomplete.collectionProps.value['aria-label']).toBe('Suggestions');

    let composedAutocomplete = useAutocomplete({
      'aria-label': 'Search suggestions',
      'aria-labelledby': 'external-suggestions-label',
      id: 'suggestions-listbox',
      inputValue,
      items: ['Vue']
    });
    let composedIds = composedAutocomplete.collectionProps.value['aria-labelledby']?.split(/\s+/) ?? [];
    expect(composedIds).toContain('external-suggestions-label');
    expect(composedIds).toContain('suggestions-listbox');
    expect(composedAutocomplete.collectionProps.value['aria-label']).toBe('Search suggestions');
  });

  it('submits and clears search autocomplete state', () => {
    let inputValue = ref('rea');
    let submissions: Array<{focusedKey: string | null, value: string}> = [];
    let clearCount = 0;

    let autocomplete = useSearchAutocomplete({
      inputValue,
      items: ['React', 'Vue'],
      onClear: () => {
        clearCount += 1;
      },
      onSubmit: (value, focusedKey) => {
        submissions.push({value, focusedKey});
      }
    });

    autocomplete.submit();
    expect(submissions).toEqual([]);

    autocomplete.clear();
    expect(inputValue.value).toBe('');
    expect(clearCount).toBe(1);
    expect(autocomplete.clearButtonProps.value.disabled).toBe(false);

    let manualAutocomplete = useSearchAutocomplete({
      inputValue: ref('rea'),
      items: ['React', 'Vue'],
      onSubmit: (value, focusedKey) => {
        submissions.push({value, focusedKey});
      },
      shouldAutoFocusFirst: false
    });
    manualAutocomplete.submit();
    expect(submissions).toEqual([{value: 'rea', focusedKey: null}]);

    let disabledAutocomplete = useSearchAutocomplete({
      disabled: true,
      inputValue: ref('rea'),
      items: ['React', 'Vue']
    });
    expect(disabledAutocomplete.clearButtonProps.value.disabled).toBe(true);
  });

  it('manages vue-stately autocomplete input and focused node state', () => {
    let uncontrolledChanges: string[] = [];
    let uncontrolledState = useStatelyAutocompleteState({
      defaultInputValue: 'Vue',
      onInputChange: (value) => {
        uncontrolledChanges.push(value);
      }
    });

    expect(uncontrolledState.inputValue.value).toBe('Vue');
    uncontrolledState.setInputValue('Vue Spectrum');
    uncontrolledState.setFocusedNodeId('option-vue');
    expect(uncontrolledState.inputValue.value).toBe('Vue Spectrum');
    expect(uncontrolledChanges).toEqual(['Vue Spectrum']);
    expect(uncontrolledState.focusedNodeId.value).toBe('option-vue');

    let controlledInput = ref('React');
    let controlledChanges: string[] = [];
    let controlledState = useStatelyAutocompleteState({
      inputValue: controlledInput,
      onInputChange: (value) => {
        controlledChanges.push(value);
        controlledInput.value = value;
      }
    });

    expect(controlledState.inputValue.value).toBe('React');
    controlledState.setInputValue('Vue');
    expect(controlledChanges).toEqual(['Vue']);
    controlledState.setInputValue('Vue');
    expect(controlledChanges).toEqual(['Vue']);
    expect(controlledState.inputValue.value).toBe('Vue');
  });

  it('suppresses duplicate vue-stately autocomplete controlled callbacks without parent sync in one turn', () => {
    let controlledInput = ref<string | undefined>('React');
    let controlledChanges: string[] = [];
    let controlledState = useStatelyAutocompleteState({
      inputValue: controlledInput,
      onInputChange: (value) => {
        controlledChanges.push(value);
      }
    });

    controlledState.setInputValue('Vue');
    controlledState.setInputValue('Vue');

    expect(controlledInput.value).toBe('React');
    expect(controlledState.inputValue.value).toBe('React');
    expect(controlledChanges).toEqual(['Vue']);
  });

  it('warns when vue-stately autocomplete switches between controlled and uncontrolled', async () => {
    let warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    let controlledInput = ref<string | undefined>('React');
    useStatelyAutocompleteState({
      inputValue: controlledInput
    });

    try {
      controlledInput.value = undefined;
      await nextTick();
      expect(warnSpy).toHaveBeenLastCalledWith('WARN: A component changed from controlled to uncontrolled.');

      controlledInput.value = 'Vue';
      await nextTick();
      expect(warnSpy).toHaveBeenLastCalledWith('WARN: A component changed from uncontrolled to controlled.');
    } finally {
      warnSpy.mockRestore();
    }
  });

  it('keeps vue-stately autocomplete uncontrolled when input ref is undefined', () => {
    let inputValue = ref<string | undefined>(undefined);
    let changes: string[] = [];
    let state = useStatelyAutocompleteState({
      defaultInputValue: 'Vue',
      inputValue,
      onInputChange: (value) => {
        changes.push(value);
      }
    });

    state.setInputValue('React');

    expect(inputValue.value).toBeUndefined();
    expect(state.inputValue.value).toBe('React');
    expect(changes).toEqual(['React']);
  });

  it('provides breadcrumb nav props with default and custom labels', () => {
    let breadcrumbs = useBreadcrumbs();
    expect(breadcrumbs.navProps.value['aria-label']).toBe('Breadcrumbs');

    let customBreadcrumbs = useBreadcrumbs({
      ariaLabel: ref('Project trail')
    });
    expect(customBreadcrumbs.navProps.value['aria-label']).toBe('Project trail');

    let dashedBreadcrumbs = useBreadcrumbs({
      'aria-label': 'Release path',
      id: 'release-breadcrumbs'
    });
    expect(dashedBreadcrumbs.navProps.value['aria-label']).toBe('Release path');
    expect(dashedBreadcrumbs.navProps.value.id).toBe('release-breadcrumbs');
  });

  it('computes breadcrumb item props and press behavior', () => {
    let pressCount = 0;
    let item = useBreadcrumbItem({
      elementType: 'span',
      onPress: () => {
        pressCount += 1;
      }
    });

    expect(item.itemProps.value.role).toBe('link');
    expect(item.itemProps.value.tabindex).toBe(0);
    expect(item.itemProps.value['aria-disabled']).toBeUndefined();
    item.press();
    expect(pressCount).toBe(1);

    let currentItem = useBreadcrumbItem({
      autoFocus: true,
      elementType: 'span',
      isCurrent: true,
      onPress: () => {
        pressCount += 1;
      }
    });

    expect(currentItem.itemProps.value['aria-current']).toBe('page');
    expect(currentItem.itemProps.value['aria-disabled']).toBe(true);
    expect(currentItem.itemProps.value.tabindex).toBe(-1);
    currentItem.press();
    expect(pressCount).toBe(1);
  });

  it('computes vue-aria button props and press interactions', () => {
    let pressCount = 0;
    let clickCount = 0;
    let pressUpCount = 0;
    let button = useButton({
      elementType: 'a',
      href: '/docs',
      onClick: () => {
        clickCount += 1;
      },
      onPress: () => {
        pressCount += 1;
      },
      onPressUp: () => {
        pressUpCount += 1;
      }
    });

    expect(button.buttonProps.value.role).toBe('button');
    expect(button.buttonProps.value.href).toBe('/docs');
    expect(button.buttonProps.value.tabindex).toBe(0);
    button.press();
    expect(button.isPressed.value).toBe(false);
    expect(pressCount).toBe(1);
    expect(pressUpCount).toBe(1);
    expect(clickCount).toBe(1);

    let disabledButton = useButton({
      elementType: 'a',
      href: '/docs',
      isDisabled: true
    });
    expect(disabledButton.buttonProps.value['aria-disabled']).toBe(true);
    expect(disabledButton.buttonProps.value.href).toBeUndefined();
    disabledButton.press();
    expect(clickCount).toBe(1);
    expect(pressUpCount).toBe(1);

    let nativeButton = useButton({
      elementType: 'button',
      form: 'docs-form',
      formAction: '/submit',
      formEncType: 'multipart/form-data',
      formMethod: 'post',
      formNoValidate: true,
      formTarget: '_blank',
      name: 'action',
      type: 'submit',
      value: 'save'
    });
    expect(nativeButton.buttonProps.value.type).toBe('submit');
    expect(nativeButton.buttonProps.value.form).toBe('docs-form');
    expect(nativeButton.buttonProps.value.formAction).toBe('/submit');
    expect(nativeButton.buttonProps.value.formEncType).toBe('multipart/form-data');
    expect(nativeButton.buttonProps.value.formMethod).toBe('post');
    expect(nativeButton.buttonProps.value.formNoValidate).toBe(true);
    expect(nativeButton.buttonProps.value.formTarget).toBe('_blank');
    expect(nativeButton.buttonProps.value.name).toBe('action');
    expect(nativeButton.buttonProps.value.value).toBe('save');
  });

  it('toggles vue-aria button selection and group-item radio state', () => {
    let isSelected = ref(false);
    let toggleButton = useToggleButton({
      isSelected
    });

    toggleButton.press();
    expect(isSelected.value).toBe(true);
    expect(toggleButton.buttonProps.value['aria-pressed']).toBe(true);

    let selectedKeys = ref<Iterable<string>>(['bold']);
    let group = useToggleButtonGroup({
      selectedKeys,
      selectionMode: 'single'
    });
    expect(group.groupProps.value.role).toBe('radiogroup');
    expect(typeof group.groupProps.value.onKeyDownCapture).toBe('function');

    let italicItem = useToggleButtonGroupItem({
      group,
      id: 'italic'
    });

    expect(italicItem.buttonProps.value.role).toBe('radio');
    expect(italicItem.buttonProps.value['aria-checked']).toBe(false);
    italicItem.press();
    expect(selectedKeys.value instanceof Set).toBe(true);
    expect(Array.from(selectedKeys.value)).toEqual(['italic']);

    let groupItemClickCount = 0;
    let groupItemPressUpCount = 0;
    let boldItem = useToggleButtonGroupItem({
      group,
      id: 'bold',
      onClick: () => {
        groupItemClickCount += 1;
      },
      onPressUp: () => {
        groupItemPressUpCount += 1;
      }
    });
    boldItem.press();
    expect(groupItemClickCount).toBe(1);
    expect(groupItemPressUpCount).toBe(1);
    expect(Array.from(selectedKeys.value)).toEqual(['bold']);

    let disabledSelectionChanges = 0;
    let disabledKeys = ref<Iterable<string>>(new Set(['bold']));
    let disabledGroup = useToggleButtonGroup({
      isDisabled: true,
      selectedKeys: disabledKeys,
      selectionMode: 'multiple'
    });
    let disabledItem = useToggleButtonGroupItem({
      group: disabledGroup,
      id: 'italic',
      onSelectionChange: () => {
        disabledSelectionChanges += 1;
      }
    });
    disabledItem.press();
    expect(disabledSelectionChanges).toBe(0);
    expect(Array.from(disabledKeys.value)).toEqual(['bold']);
  });

  it('manages vue-aria calendar navigation and date selection', () => {
    let selectedDate = ref<Date | null>(new Date(2025, 0, 15));
    let visibleDate = ref(new Date(2025, 0, 1));
    let calendar = useCalendar({
      value: selectedDate,
      visibleDate
    });

    expect(calendar.calendarProps.value.role).toBe('application');
    expect(calendar.calendarProps.value['aria-label']).toContain(calendar.visibleRangeLabel.value);
    expect(calendar.visibleRangeLabel.value).toContain('2025');
    calendar.nextPage();
    expect(calendar.visibleDate.value.getMonth()).toBe(1);

    calendar.selectDate(new Date(2025, 1, 10));
    expect(selectedDate.value?.getMonth()).toBe(1);
    expect(selectedDate.value?.getDate()).toBe(10);

    let composedCalendar = useCalendar({
      'aria-label': 'Project schedule',
      'aria-labelledby': 'external-calendar-label',
      id: 'project-calendar',
      visibleDate: ref(new Date(2025, 0, 1))
    });
    let composedCalendarLabelledByIds = composedCalendar.calendarProps.value['aria-labelledby']?.split(/\s+/) ?? [];
    expect(composedCalendarLabelledByIds).toContain('external-calendar-label');
    expect(composedCalendarLabelledByIds).toContain('project-calendar');
    expect(composedCalendar.calendarProps.value['aria-label']).toContain('Project schedule');
  });

  it('pages vue-aria calendar by visible duration unless pageBehavior is single', () => {
    let visibleByDuration = ref(new Date(2025, 0, 1));
    let durationCalendar = useCalendar({
      visibleDate: visibleByDuration,
      visibleDuration: {months: 2}
    });

    durationCalendar.nextPage();
    expect(visibleByDuration.value.getMonth()).toBe(2);
    durationCalendar.prevPage();
    expect(visibleByDuration.value.getMonth()).toBe(0);

    let visibleSingle = ref(new Date(2025, 0, 1));
    let singleBehaviorCalendar = useCalendar({
      pageBehavior: 'single',
      visibleDate: visibleSingle,
      visibleDuration: {months: 2}
    });

    singleBehaviorCalendar.nextPage();
    expect(visibleSingle.value.getMonth()).toBe(1);
    singleBehaviorCalendar.prevPage();
    expect(visibleSingle.value.getMonth()).toBe(0);
  });

  it('builds calendar grid and cell selection for date and range flows', () => {
    let visibleDate = ref(new Date(2025, 0, 1));
    let calendar = useCalendar({visibleDate});
    let grid = useCalendarGrid({visibleDate});
    let tuesdayFirstGrid = useCalendarGrid({
      visibleDate,
      firstDayOfWeek: 2,
      locale: 'en-US'
    });

    expect(grid.gridProps.value.role).toBe('grid');
    expect(grid.gridProps.value['aria-label']).toContain('2025');
    expect(grid.weekDays.value).toHaveLength(7);
    expect(grid.weeks.value).toHaveLength(6);
    expect(tuesdayFirstGrid.weekDays.value[0]).toMatch(/^Tue/i);
    expect(tuesdayFirstGrid.weeks.value[0][0].getDay()).toBe(2);

    let composedGrid = useCalendarGrid({
      'aria-label': 'Project schedule grid',
      'aria-labelledby': 'external-calendar-grid-label',
      id: 'project-calendar-grid',
      visibleDate
    });
    let composedGridLabelledByIds = composedGrid.gridProps.value['aria-labelledby']?.split(/\s+/) ?? [];
    expect(composedGridLabelledByIds).toContain('external-calendar-grid-label');
    expect(composedGridLabelledByIds).toContain('project-calendar-grid');
    expect(composedGrid.gridProps.value['aria-label']).toContain('Project schedule grid');

    let cellDate = grid.weeks.value[2][3];
    let cell = useCalendarCell({
      calendar,
      date: cellDate
    });
    cell.press();
    expect(calendar.selectedDate.value?.getDate()).toBe(cellDate.getDate());

    let rangeValue = ref({
      start: null as Date | null,
      end: null as Date | null
    });
    let rangeCalendar = useRangeCalendar({
      visibleDate: ref(new Date(2025, 0, 1)),
      value: rangeValue
    });
    expect(rangeCalendar.calendarProps.value.role).toBe('application');
    expect(rangeCalendar.calendarProps.value['aria-label']).toContain(rangeCalendar.visibleRangeLabel.value);
    rangeCalendar.selectDate(new Date(2025, 0, 5));
    rangeCalendar.selectDate(new Date(2025, 0, 8));

    let rangeCell = useCalendarCell({
      calendar: rangeCalendar,
      date: new Date(2025, 0, 6)
    });
    expect(rangeCell.isSelected.value).toBe(true);

    let febDate = new Date(2025, 1, 1);
    let defaultOutsideCell = useCalendarCell({
      calendar,
      date: febDate
    });
    let offsetMonthCell = useCalendarCell({
      calendar,
      date: febDate,
      visibleDate: ref(new Date(2025, 1, 1))
    });
    expect(defaultOutsideCell.isOutsideVisibleRange.value).toBe(true);
    expect(offsetMonthCell.isOutsideVisibleRange.value).toBe(false);
  });

  it('manages vue-stately calendar and range-calendar state transitions', () => {
    let selectedDate = ref<Date | null>(new Date(2025, 0, 15));
    let dateChanges: Array<Date | null> = [];
    let calendarState = useStatelyCalendarState({
      value: selectedDate,
      onChange: (value) => {
        dateChanges.push(value ? new Date(value) : null);
        selectedDate.value = value ? new Date(value) : null;
      }
    });

    expect(calendarState.isSelected(new Date(2025, 0, 15))).toBe(true);
    calendarState.focusNextDay();
    calendarState.selectFocusedDate();
    expect(selectedDate.value?.getDate()).toBe(16);
    expect(dateChanges[dateChanges.length - 1]?.getDate()).toBe(16);
    calendarState.focusNextPage();
    expect(calendarState.visibleRange.value.start.getMonth()).toBe(1);

    let selectedRange = ref({
      start: null as Date | null,
      end: null as Date | null
    });
    let rangeChanges: Array<{end: Date | null, start: Date | null}> = [];
    let rangeState = useStatelyRangeCalendarState({
      value: selectedRange,
      onChange: (value) => {
        rangeChanges.push({
          start: value.start ? new Date(value.start) : null,
          end: value.end ? new Date(value.end) : null
        });
        selectedRange.value = {
          start: value.start ? new Date(value.start) : null,
          end: value.end ? new Date(value.end) : null
        };
      }
    });

    rangeState.selectDate(new Date(2025, 0, 5));
    rangeState.selectDate(new Date(2025, 0, 8));
    expect(selectedRange.value.start?.getDate()).toBe(5);
    expect(selectedRange.value.end?.getDate()).toBe(8);
    expect(rangeState.isSelected(new Date(2025, 0, 6))).toBe(true);
    expect(rangeChanges.length).toBeGreaterThan(0);
  });

  it('keeps vue-stately calendar and range-calendar controlled without mutating control refs', () => {
    let selectedDate = ref<Date | null>(new Date(2025, 0, 15));
    let dateChanges: Array<Date | null> = [];
    let calendarState = useStatelyCalendarState({
      onChange: (value) => {
        dateChanges.push(value ? new Date(value) : null);
      },
      value: selectedDate
    });

    calendarState.selectDate(new Date(2025, 0, 16));
    expect(selectedDate.value?.getDate()).toBe(15);
    expect(dateChanges).toHaveLength(1);
    expect(dateChanges[0]?.getDate()).toBe(16);

    calendarState.setValue(new Date(2025, 0, 20));
    expect(selectedDate.value?.getDate()).toBe(15);
    expect(dateChanges).toHaveLength(2);
    expect(dateChanges[1]?.getDate()).toBe(20);

    let selectedRange = ref({
      start: null as Date | null,
      end: null as Date | null
    });
    let rangeChanges: Array<{end: Date | null, start: Date | null}> = [];
    let rangeState = useStatelyRangeCalendarState({
      onChange: (value) => {
        rangeChanges.push({
          start: value.start ? new Date(value.start) : null,
          end: value.end ? new Date(value.end) : null
        });
      },
      value: selectedRange
    });

    rangeState.selectDate(new Date(2025, 0, 5));
    rangeState.selectDate(new Date(2025, 0, 8));
    expect(selectedRange.value.start).toBeNull();
    expect(selectedRange.value.end).toBeNull();
    expect(rangeChanges).toHaveLength(2);
    expect(rangeChanges[0].start?.getDate()).toBe(5);
    expect(rangeChanges[0].end).toBeNull();
    expect(rangeChanges[1].start?.getDate()).toBe(5);
    expect(rangeChanges[1].end?.getDate()).toBe(8);

    rangeState.setValue({
      start: new Date(2025, 0, 10),
      end: new Date(2025, 0, 12)
    });
    expect(selectedRange.value.start).toBeNull();
    expect(selectedRange.value.end).toBeNull();
    expect(rangeChanges).toHaveLength(3);
    expect(rangeChanges[2].start?.getDate()).toBe(10);
    expect(rangeChanges[2].end?.getDate()).toBe(12);
  });

  it('warns when vue-stately calendar and range-calendar switch between controlled and uncontrolled', async () => {
    let warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    try {
      let selectedDate = ref<Date | null | undefined>(new Date(2025, 0, 15));
      useStatelyCalendarState({
        value: selectedDate
      });

      selectedDate.value = undefined;
      await nextTick();
      expect(warnSpy).toHaveBeenLastCalledWith('WARN: A component changed from controlled to uncontrolled.');

      selectedDate.value = new Date(2025, 0, 16);
      await nextTick();
      expect(warnSpy).toHaveBeenLastCalledWith('WARN: A component changed from uncontrolled to controlled.');

      let selectedRange = ref<{end: Date | null, start: Date | null} | undefined>({
        start: new Date(2025, 0, 5),
        end: new Date(2025, 0, 8)
      });
      useStatelyRangeCalendarState({
        value: selectedRange
      });

      selectedRange.value = undefined;
      await nextTick();
      expect(warnSpy).toHaveBeenLastCalledWith('WARN: A component changed from controlled to uncontrolled.');

      selectedRange.value = {
        start: new Date(2025, 0, 10),
        end: new Date(2025, 0, 12)
      };
      await nextTick();
      expect(warnSpy).toHaveBeenLastCalledWith('WARN: A component changed from uncontrolled to controlled.');
    } finally {
      warnSpy.mockRestore();
    }
  });

  it('keeps vue-stately calendar and range-calendar uncontrolled when value refs are undefined', () => {
    let selectedDate = ref<Date | null | undefined>(undefined);
    let calendarState = useStatelyCalendarState({
      defaultValue: new Date(2025, 0, 15),
      value: selectedDate
    });

    calendarState.selectDate(new Date(2025, 0, 16));
    expect(selectedDate.value).toBeUndefined();
    expect(calendarState.value.value?.getDate()).toBe(16);

    let selectedRange = ref<{end: Date | null, start: Date | null} | undefined>(undefined);
    let rangeState = useStatelyRangeCalendarState({
      defaultValue: {
        start: new Date(2025, 0, 5),
        end: new Date(2025, 0, 8)
      },
      value: selectedRange
    });

    rangeState.setValue({
      start: new Date(2025, 0, 10),
      end: new Date(2025, 0, 12)
    });
    expect(selectedRange.value).toBeUndefined();
    expect(rangeState.value.value.start?.getDate()).toBe(10);
    expect(rangeState.value.value.end?.getDate()).toBe(12);
  });

  it('toggles vue-aria checkbox selection and mixed state flags', () => {
    let isSelected = ref(false);
    let checkbox = useCheckbox({
      isIndeterminate: true,
      isSelected
    });

    expect(checkbox.inputProps.value['aria-checked']).toBe('mixed');
    checkbox.press();
    expect(isSelected.value).toBe(true);
    expect(checkbox.isPressed.value).toBe(false);
  });

  it('updates checkbox group selections through group item composables', () => {
    let changes: string[][] = [];
    let selectedValues = ref<Iterable<string>>(['Docs']);
    let group = useCheckboxGroup({
      name: 'features',
      onChange: (nextValues) => {
        changes.push(Array.from(nextValues));
      },
      selectedValues
    });

    let testsItem = useCheckboxGroupItem({
      group,
      value: 'Tests'
    });

    expect(testsItem.inputProps.value.name).toBe('features');
    testsItem.press();
    expect(Array.from(selectedValues.value)).toEqual(['Docs', 'Tests']);
    expect(changes).toEqual([['Docs', 'Tests']]);

    testsItem.press();
    expect(Array.from(selectedValues.value)).toEqual(['Docs']);
    expect(changes).toEqual([['Docs', 'Tests'], ['Docs']]);

    group.setSelected('Docs', true);
    expect(changes).toEqual([['Docs', 'Tests'], ['Docs']]);
  });

  it('manages vue-stately checkbox-group values and invalid flags', () => {
    let selectedValues = ref(['Docs']);
    let changes: string[][] = [];
    let state = useStatelyCheckboxGroupState({
      isRequired: true,
      onChange: (value) => {
        changes.push([...value]);
        selectedValues.value = value;
      },
      value: selectedValues
    });

    expect(state.defaultValue).toEqual(['Docs']);
    expect(state.isSelected('Docs')).toBe(true);
    state.toggleValue('Tests');
    expect(selectedValues.value).toEqual(['Docs', 'Tests']);

    state.removeValue('Docs');
    expect(selectedValues.value).toEqual(['Tests']);
    expect(state.isRequired.value).toBe(false);

    state.setInvalid('Tests', {isInvalid: true});
    expect(state.isInvalid.value).toBe(true);
    state.setInvalid('Tests', {isInvalid: false});
    expect(state.isInvalid.value).toBe(false);
    expect(changes).toContainEqual(['Docs', 'Tests']);
  });

  it('keeps vue-stately checkbox-group controlled without mutating control refs', () => {
    let selectedValues = ref(['Docs']);
    let changes: string[][] = [];
    let state = useStatelyCheckboxGroupState({
      onChange: (value) => {
        changes.push([...value]);
      },
      value: selectedValues
    });

    state.addValue('Tests');

    expect(selectedValues.value).toEqual(['Docs']);
    expect(state.value.value).toEqual(['Docs']);
    expect(changes).toEqual([['Docs', 'Tests']]);
  });

  it('suppresses duplicate vue-stately checkbox-group controlled callbacks for the same update in one turn', () => {
    let selectedValues = ref(['Docs']);
    let changes: string[][] = [];
    let state = useStatelyCheckboxGroupState({
      onChange: (value) => {
        changes.push([...value]);
      },
      value: selectedValues
    });

    let requestedValues = ['Docs', 'Tests'];
    state.setValue(requestedValues);
    state.setValue(requestedValues);

    expect(selectedValues.value).toEqual(['Docs']);
    expect(state.value.value).toEqual(['Docs']);
    expect(changes).toEqual([['Docs', 'Tests']]);
  });

  it('matches vue-stately checkbox-group setValue identity semantics', () => {
    let selectedValues = ref(['Docs']);
    let changes: string[][] = [];
    let state = useStatelyCheckboxGroupState({
      onChange: (value) => {
        changes.push([...value]);
        selectedValues.value = value;
      },
      value: selectedValues
    });

    let sameValueRef = selectedValues.value;
    state.setValue(sameValueRef);
    expect(changes).toEqual([]);

    state.setValue([...sameValueRef]);
    expect(changes).toEqual([['Docs']]);
  });

  it('preserves vue-stately checkbox-group duplicate values for value/defaultValue/setValue parity', () => {
    let controlledValues = ref(['Docs']);
    let changes: string[][] = [];
    let controlledState = useStatelyCheckboxGroupState({
      onChange: (value) => {
        changes.push([...value]);
        controlledValues.value = value;
      },
      value: controlledValues
    });

    controlledState.setValue(['Docs', 'Docs', 'API']);
    expect(controlledValues.value).toEqual(['Docs', 'Docs', 'API']);
    expect(changes).toEqual([['Docs', 'Docs', 'API']]);

    let uncontrolledState = useStatelyCheckboxGroupState({
      defaultValue: ['One', 'One']
    });
    expect(uncontrolledState.value.value).toEqual(['One', 'One']);
    expect(uncontrolledState.defaultValue).toEqual(['One', 'One']);
  });

  it('warns when vue-stately checkbox group switches between controlled and uncontrolled', async () => {
    let warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    let selectedValues = ref<string[] | undefined>(['Docs']);
    useStatelyCheckboxGroupState({
      value: selectedValues
    });

    try {
      selectedValues.value = undefined;
      await nextTick();
      expect(warnSpy).toHaveBeenLastCalledWith('WARN: A component changed from controlled to uncontrolled.');

      selectedValues.value = ['Tests'];
      await nextTick();
      expect(warnSpy).toHaveBeenLastCalledWith('WARN: A component changed from uncontrolled to controlled.');
    } finally {
      warnSpy.mockRestore();
    }
  });

  it('keeps vue-stately checkbox group uncontrolled when value ref is undefined', () => {
    let selectedValues = ref<string[] | undefined>(undefined);
    let state = useStatelyCheckboxGroupState({
      defaultValue: ['Docs'],
      value: selectedValues
    });

    state.addValue('Tests');

    expect(selectedValues.value).toBeUndefined();
    expect(state.value.value).toEqual(['Docs', 'Tests']);
  });

  it('builds and filters vue-aria collections with key navigation', () => {
    let builder = new CollectionBuilder<{id: string, label: string}>();
    let collection = builder.build({
      getKey: (item) => item.id,
      getTextValue: (item) => item.label,
      items: [
        {id: 'alpha', label: 'Alpha'},
        {id: 'beta', label: 'Beta'}
      ]
    });

    expect(collection.getFirstKey()).toBe('alpha');
    expect(collection.getKeyAfter('alpha')).toBe('beta');

    let filtered = collection.filter((textValue) => textValue.startsWith('A'));
    expect(filtered.getFirstKey()).toBe('alpha');
    expect(filtered.getLastKey()).toBe('alpha');
  });

  it('builds vue-stately collections and traverses nodes with helper utilities', () => {
    let collection = useStatelyCollection({
      getKey: (item) => item.id,
      getTextValue: (item) => item.label,
      items: [
        {id: 'alpha', label: 'Alpha'},
        {id: 'beta', label: 'Beta'}
      ]
    });

    expect(collection.value.getFirstKey()).toBe('alpha');
    expect(getStatelyItemCount(collection.value)).toBe(2);
    expect(getFirstStatelyItem(collection.value)?.key).toBe('alpha');
    expect(getLastStatelyItem(collection.value)?.key).toBe('beta');
    expect(getNthStatelyItem(collection.value, 1)?.key).toBe('beta');
    expect(getStatelyChildNodes(collection.value).map((node) => node.key)).toEqual(['alpha', 'beta']);
    expect(compareStatelyNodeOrder(collection.value, 'alpha', 'beta')).toBe(-1);
  });

  it('caches vue-aria collection children by item identity', () => {
    let alpha = {id: 'alpha', label: 'Alpha'};
    let beta = {id: 'beta', label: 'Beta'};
    let items = ref([alpha, beta]);

    let cachedChildren = useCachedChildren({
      addIdAndValue: true,
      children: (item: {id: string, label: string}) => item.label,
      getKey: (item: {id: string, label: string}) => item.id,
      idScope: 'starter',
      items
    });

    let firstPass = cachedChildren.value as Array<{key: string, rendered: unknown}>;
    expect(firstPass[0].key).toBe('starter:alpha');
    expect(firstPass[0].rendered).toBe('Alpha');

    items.value = [alpha, beta];
    let secondPass = cachedChildren.value as Array<{key: string, rendered: unknown}>;
    expect(secondPass[0]).toBe(firstPass[0]);
  });

  it('updates vue-aria color slider, channel field, and text field values', () => {
    let channelValue = ref(40);
    let slider = useColorSlider({
      channel: 'hue',
      value: channelValue
    });

    slider.increment();
    expect(channelValue.value).toBe(41);
    slider.setValue(720);
    expect(channelValue.value).toBe(360);

    let channelField = useColorChannelField({
      channel: 'hue',
      value: channelValue
    });
    channelField.decrement();
    expect(channelValue.value).toBe(359);

    let colorText = ref('#ff0000');
    let colorField = useColorField({
      value: colorText
    });
    colorField.setValue('00ff00');
    expect(colorText.value).toBe('#00ff00');
  });

  it('updates vue-aria color area, wheel, and swatch props', () => {
    let x = ref(0);
    let y = ref(0);
    let area = useColorArea({
      x,
      y
    });
    area.setValue(0.25, 0.75);
    expect(x.value).toBeCloseTo(0.25);
    expect(y.value).toBeCloseTo(0.75);
    expect(area.areaProps.value['aria-label']).toBe('Color picker');

    let composedArea = useColorArea({
      'aria-label': 'Saturation area',
      'aria-labelledby': 'external-color-area-label',
      id: 'color-area',
      x,
      y
    });
    let areaLabelledByIds = composedArea.areaProps.value['aria-labelledby']?.split(/\s+/) ?? [];
    expect(areaLabelledByIds).toContain('external-color-area-label');
    expect(areaLabelledByIds).toContain('color-area');
    expect(composedArea.areaProps.value['aria-label']).toBe('Saturation area');

    let angle = ref(0);
    let radius = ref(0);
    let wheel = useColorWheel({
      angle,
      radius
    });
    wheel.setValue(420, 0.5);
    expect(angle.value).toBe(60);
    expect(radius.value).toBe(0.5);
    expect(wheel.wheelProps.value['aria-label']).toBe('Hue');

    let composedWheel = useColorWheel({
      'aria-label': 'Hue wheel',
      'aria-labelledby': 'external-color-wheel-label',
      id: 'color-wheel',
      angle,
      radius
    });
    let wheelLabelledByIds = composedWheel.wheelProps.value['aria-labelledby']?.split(/\s+/) ?? [];
    expect(wheelLabelledByIds).toContain('external-color-wheel-label');
    expect(wheelLabelledByIds).toContain('color-wheel');
    expect(composedWheel.wheelProps.value['aria-label']).toBe('Hue wheel');

    let swatch = useColorSwatch({
      color: ref('ff00ff')
    });
    expect(swatch.swatchProps.value.style.backgroundColor).toBe('#ff00ff');
  });

  it('manages vue-stately color area/slider/field/channel/picker state baselines', () => {
    let areaValue = ref('#000000');
    let areaChanges: string[] = [];
    let area = useStatelyColorAreaState({
      onChange: (nextValue) => {
        areaChanges.push(nextValue);
        areaValue.value = nextValue;
      },
      value: areaValue
    });
    area.setColorFromPoint(1, 0);
    expect(areaValue.value).toBe('#ffff00');
    expect(areaChanges).toEqual(['#ffff00']);
    area.setColorFromPoint(1, 0);
    expect(areaChanges).toEqual(['#ffff00']);

    let sliderValue = ref('#000000');
    let sliderChanges: string[] = [];
    let slider = useStatelyColorSliderState({
      channel: 'red',
      onChange: (nextValue) => {
        sliderChanges.push(nextValue);
        sliderValue.value = nextValue;
      },
      value: sliderValue
    });
    slider.increment(32);
    expect(sliderValue.value).toBe('#200000');
    expect(sliderChanges).toEqual(['#200000']);
    slider.setValue('#200000');
    expect(sliderChanges).toEqual(['#200000']);

    let field = useStatelyColorFieldState({
      defaultValue: '#112233'
    });
    field.setInputValue('#445566');
    field.commit();
    expect(field.colorValue.value).toBe('#445566');

    let controlledFieldValue = ref<string | null>('#445566');
    let fieldChanges: Array<string | null> = [];
    let controlledField = useStatelyColorFieldState({
      onChange: (nextValue) => {
        fieldChanges.push(nextValue);
        controlledFieldValue.value = nextValue;
      },
      value: controlledFieldValue
    });
    controlledField.setColorValue('#445566');
    expect(fieldChanges).toEqual([]);
    controlledField.setColorValue('#556677');
    expect(fieldChanges).toEqual(['#556677']);
    controlledField.setColorValue('#556677');
    expect(fieldChanges).toEqual(['#556677']);

    let wheelValue = ref('#000000');
    let wheelChanges: string[] = [];
    let wheelChangeEnd: string[] = [];
    let wheelState = useStatelyColorWheelState({
      onChange: (nextValue) => {
        wheelChanges.push(nextValue);
        wheelValue.value = nextValue;
      },
      onChangeEnd: (nextValue) => {
        wheelChangeEnd.push(nextValue);
      },
      value: wheelValue
    });
    wheelState.setHue(wheelState.hue.value);
    expect(wheelChanges).toEqual([]);
    wheelState.setHue(120);
    expect(wheelChanges).toHaveLength(1);
    wheelState.setDragging(true);
    wheelState.setDragging(false);
    expect(wheelChangeEnd).toEqual([wheelValue.value]);

    let channelState = useStatelyColorChannelFieldState({
      channel: 'green',
      onChange: (nextValue) => {
        sliderValue.value = nextValue;
      },
      value: sliderValue
    });
    channelState.setInputValue('64');
    expect(sliderValue.value).toBe('#204000');

    let pickerValue = ref('#abcdef');
    let picker = useStatelyColorPickerState({
      onChange: (nextValue) => {
        pickerValue.value = nextValue;
      },
      value: pickerValue
    });
    picker.open();
    picker.setColorValue('#123456');
    picker.close();
    expect(picker.isOpen.value).toBe(false);
    expect(pickerValue.value).toBe('#123456');
    expect(parseStatelyColor('#abc')).toBe('#aabbcc');
  });

  it('keeps vue-stately color picker and channel-field controlled without mutating control refs', () => {
    let pickerValue = ref('#abcdef');
    let pickerChanges: string[] = [];
    let picker = useStatelyColorPickerState({
      onChange: (nextValue) => {
        pickerChanges.push(nextValue);
      },
      value: pickerValue
    });

    picker.setColorValue('#123456');
    expect(pickerValue.value).toBe('#abcdef');
    expect(pickerChanges).toEqual(['#123456']);
    picker.setColorValue('#123456');
    expect(pickerChanges).toEqual(['#123456']);

    let channelValue = ref('#112233');
    let channelChanges: string[] = [];
    let channelState = useStatelyColorChannelFieldState({
      channel: 'red',
      onChange: (nextValue) => {
        channelChanges.push(nextValue);
      },
      value: channelValue
    });

    channelState.setInputValue('64');
    expect(channelValue.value).toBe('#112233');
    expect(channelChanges).toEqual(['#402233']);
    channelState.setInputValue('64');
    expect(channelChanges).toEqual(['#402233']);
  });

  it('keeps vue-stately color area, field, slider, and wheel controlled without mutating control refs', () => {
    let areaValue = ref('#000000');
    let areaChanges: string[] = [];
    let area = useStatelyColorAreaState({
      onChange: (nextValue) => {
        areaChanges.push(nextValue);
      },
      value: areaValue
    });

    area.setColorFromPoint(1, 0);
    area.setColorFromPoint(1, 0);
    expect(areaValue.value).toBe('#000000');
    expect(areaChanges).toEqual(['#ffff00']);

    let fieldValue = ref<string | null>('#445566');
    let fieldChanges: Array<string | null> = [];
    let field = useStatelyColorFieldState({
      onChange: (nextValue) => {
        fieldChanges.push(nextValue);
      },
      value: fieldValue
    });

    field.setColorValue('#556677');
    field.setColorValue('#556677');
    expect(fieldValue.value).toBe('#445566');
    expect(fieldChanges).toEqual(['#556677']);

    let sliderValue = ref('#000000');
    let sliderChanges: string[] = [];
    let slider = useStatelyColorSliderState({
      channel: 'red',
      onChange: (nextValue) => {
        sliderChanges.push(nextValue);
      },
      value: sliderValue
    });

    slider.increment(32);
    slider.increment(32);
    expect(sliderValue.value).toBe('#000000');
    expect(sliderChanges).toEqual(['#200000']);

    let wheelValue = ref('#000000');
    let wheelChanges: string[] = [];
    let wheel = useStatelyColorWheelState({
      onChange: (nextValue) => {
        wheelChanges.push(nextValue);
      },
      value: wheelValue
    });

    wheel.setHue(120);
    wheel.setHue(120);
    expect(wheelValue.value).toBe('#000000');
    expect(wheelChanges).toHaveLength(1);
  });

  it('uses vue-stately color picker default black value when no value is provided', () => {
    let picker = useStatelyColorPickerState();
    expect(picker.colorValue.value).toBe('#000000');
  });

  it('keeps vue-stately color field empty when initialized with an invalid default value', () => {
    let field = useStatelyColorFieldState({
      defaultValue: 'invalidColor' as string
    });

    expect(field.colorValue.value).toBeNull();
    expect(field.inputValue.value).toBe('');
    expect(field.defaultColorValue).toBeNull();
  });

  it('warns when vue-stately color picker and channel-field switch between controlled and uncontrolled', async () => {
    let warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    try {
      let pickerValue = ref<string | undefined>('#abcdef');
      useStatelyColorPickerState({
        value: pickerValue
      });

      pickerValue.value = undefined;
      await nextTick();
      expect(warnSpy).toHaveBeenLastCalledWith('WARN: A component changed from controlled to uncontrolled.');

      pickerValue.value = '#123456';
      await nextTick();
      expect(warnSpy).toHaveBeenLastCalledWith('WARN: A component changed from uncontrolled to controlled.');

      let channelValue = ref<string | undefined>('#112233');
      useStatelyColorChannelFieldState({
        channel: 'red',
        value: channelValue
      });

      channelValue.value = undefined;
      await nextTick();
      expect(warnSpy).toHaveBeenLastCalledWith('WARN: A component changed from controlled to uncontrolled.');

      channelValue.value = '#445566';
      await nextTick();
      expect(warnSpy).toHaveBeenLastCalledWith('WARN: A component changed from uncontrolled to controlled.');
    } finally {
      warnSpy.mockRestore();
    }
  });

  it('keeps vue-stately color picker and channel-field uncontrolled when value refs are undefined', () => {
    let pickerValue = ref<string | undefined>(undefined);
    let picker = useStatelyColorPickerState({
      defaultValue: '#abcdef',
      value: pickerValue
    });

    picker.setColorValue('#123456');
    expect(pickerValue.value).toBeUndefined();
    expect(picker.colorValue.value).toBe('#123456');

    let channelValue = ref<string | undefined>(undefined);
    let channelState = useStatelyColorChannelFieldState({
      channel: 'red',
      defaultValue: '#112233',
      value: channelValue
    });

    channelState.setInputValue('64');
    expect(channelValue.value).toBeUndefined();
    expect(channelState.colorValue.value).toBe('#402233');
  });

  it('filters and selects options with vue-aria combobox composable state', () => {
    let inputValue = ref('');
    let selectedKey = ref<string | null>(null);
    let selectionChanges: Array<string | null> = [];
    let comboBox = useComboBox({
      inputValue,
      items: ['React', 'Vue', 'Svelte'],
      onSelectionChange: (key) => {
        selectionChanges.push(key);
      },
      selectedKey
    });

    comboBox.open('first');
    expect(comboBox.isOpen.value).toBe(true);
    expect(comboBox.focusedKey.value).toBe('React');

    inputValue.value = 'vu';
    expect(comboBox.filteredItems.value.map((item) => item.textValue)).toEqual(['Vue']);

    comboBox.selectKey('Vue');
    expect(selectedKey.value).toBe('Vue');
    expect(inputValue.value).toBe('Vue');
    expect(comboBox.isOpen.value).toBe(false);
    expect(selectionChanges).toEqual(['Vue']);

    comboBox.selectKey('Vue');
    expect(selectionChanges).toEqual(['Vue']);
  });

  it('reports vue-aria combobox open trigger reasons for open and toggle', () => {
    let inputValue = ref('');
    let openChanges: Array<[boolean, string | undefined]> = [];
    let comboBox = useComboBox({
      inputValue,
      items: ['React', 'Vue'],
      onOpenChange: (isOpen, trigger) => {
        openChanges.push([isOpen, trigger]);
      }
    });

    comboBox.open('first', 'focus');
    comboBox.open('last', 'input');
    comboBox.close();
    comboBox.toggle('first', 'manual');
    comboBox.toggle();

    expect(openChanges).toEqual([
      [true, 'focus'],
      [false, undefined],
      [true, 'manual'],
      [false, undefined]
    ]);
  });

  it('reverts non-custom combobox input to last committed value', () => {
    let inputValue = ref('');
    let comboBox = useComboBox({
      allowsCustomValue: false,
      inputValue,
      items: ['One', 'Two']
    });

    comboBox.selectKey('One');
    inputValue.value = 'Custom value';
    comboBox.commit();
    expect(inputValue.value).toBe('One');
  });

  it('manages vue-stately combobox state for filtering, selection, and revert', () => {
    let inputValue = ref('');
    let selectedKey = ref<string | null>(null);
    let inputChanges: string[] = [];
    let selectionChanges: Array<string | null> = [];
    let state = useStatelyComboBoxState({
      inputValue,
      items: ['React', 'Vue', 'Svelte'],
      onInputChange: (value) => {
        inputChanges.push(value);
        inputValue.value = value;
      },
      onSelectionChange: (key) => {
        selectionChanges.push(key);
        selectedKey.value = key;
        inputValue.value = key ?? '';
      },
      selectedKey
    });

    state.open('first');
    state.setFocused(true);
    expect(state.isOpen.value).toBe(true);
    expect(state.focusedKey.value).toBe('React');

    state.setInputValue('vu');
    expect(state.filteredCollection.value.map((item) => item.textValue)).toEqual(['Vue']);
    expect(inputChanges).toEqual(['vu']);

    state.setValue('Vue');
    expect(selectedKey.value).toBe('Vue');
    expect(state.selectedItem.value?.textValue).toBe('Vue');
    expect(selectionChanges).toEqual(['Vue']);

    state.setValue('Vue');
    expect(selectionChanges).toEqual(['Vue']);

    state.setInputValue('temporary');
    state.revert();
    expect(inputValue.value).toBe('Vue');
    expect(state.isFocused.value).toBe(true);
  });

  it('keeps vue-stately combobox controlled without mutating control refs', () => {
    let inputValue = ref('React');
    let selectedKey = ref<string | null>('React');
    let inputChanges: string[] = [];
    let selectionChanges: Array<string | null> = [];
    let state = useStatelyComboBoxState({
      inputValue,
      items: ['React', 'Vue', 'Svelte'],
      onInputChange: (value) => {
        inputChanges.push(value);
      },
      onSelectionChange: (key) => {
        selectionChanges.push(key);
      },
      selectedKey
    });

    state.setInputValue('Vu');
    expect(inputValue.value).toBe('React');
    expect(state.inputValue.value).toBe('React');
    expect(inputChanges).toEqual(['Vu']);

    state.setValue('Vue');
    expect(selectedKey.value).toBe('React');
    expect(state.selectedKey.value).toBe('React');
    expect(selectionChanges).toEqual(['Vue']);

    state.setValue('Vue');
    expect(selectionChanges).toEqual(['Vue']);
  });

  it('reports vue-stately combobox open trigger reasons for open and toggle', () => {
    let inputValue = ref('');
    let openChanges: Array<[boolean, string | undefined]> = [];
    let state = useStatelyComboBoxState({
      inputValue,
      items: ['React', 'Vue'],
      onOpenChange: (isOpen, trigger) => {
        openChanges.push([isOpen, trigger]);
      }
    });

    state.open('first', 'input');
    state.close();
    state.toggle('first', 'focus');
    state.toggle();

    expect(openChanges).toEqual([
      [true, 'input'],
      [false, undefined],
      [true, 'focus'],
      [false, undefined]
    ]);
  });

  it('warns when vue-stately combobox switches between controlled and uncontrolled', async () => {
    let warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    let inputValue = ref<string | undefined>('React');
    let selectedKey = ref<string | null | undefined>('React');
    useStatelyComboBoxState({
      inputValue,
      items: ['React', 'Vue', 'Svelte'],
      selectedKey
    });

    try {
      inputValue.value = undefined;
      await nextTick();
      expect(warnSpy).toHaveBeenLastCalledWith('WARN: A component changed from controlled to uncontrolled.');

      inputValue.value = 'Vue';
      await nextTick();
      expect(warnSpy).toHaveBeenLastCalledWith('WARN: A component changed from uncontrolled to controlled.');

      selectedKey.value = undefined;
      await nextTick();
      expect(warnSpy).toHaveBeenLastCalledWith('WARN: A component changed from controlled to uncontrolled.');

      selectedKey.value = 'Svelte';
      await nextTick();
      expect(warnSpy).toHaveBeenLastCalledWith('WARN: A component changed from uncontrolled to controlled.');
    } finally {
      warnSpy.mockRestore();
    }
  });

  it('keeps vue-stately combobox uncontrolled when control refs are undefined', () => {
    let inputValue = ref<string | undefined>(undefined);
    let selectedKey = ref<string | null | undefined>(undefined);
    let state = useStatelyComboBoxState({
      defaultInputValue: 'React',
      defaultSelectedKey: 'React',
      inputValue,
      items: ['React', 'Vue', 'Svelte'],
      selectedKey
    });

    state.setInputValue('Vue');
    state.setSelectedKey('Vue');

    expect(inputValue.value).toBeUndefined();
    expect(selectedKey.value).toBeUndefined();
    expect(state.inputValue.value).toBe('Vue');
    expect(state.selectedKey.value).toBe('Vue');
  });

  it('manages vue-stately list data insertion, selection, filtering, and movement', () => {
    let list = useStatelyListData({
      filter: (item: {id: string, label: string}, filterText: string) => {
        return item.label.toLowerCase().includes(filterText.toLowerCase());
      },
      getKey: (item) => item.id,
      initialItems: [
        {id: 'alpha', label: 'Alpha'},
        {id: 'beta', label: 'Beta'},
        {id: 'gamma', label: 'Gamma'}
      ],
      initialSelectedKeys: ['beta']
    });

    list.insertAfter('alpha', {id: 'delta', label: 'Delta'});
    list.setSelectedKeys(['alpha']);
    list.addKeysToSelection(['delta']);
    expect(Array.from(list.selectedKeys.value)).toEqual(['alpha', 'delta']);

    list.move('delta', 0);
    expect(list.items.value.map((item) => item.id)).toEqual(['delta', 'alpha', 'beta', 'gamma']);

    list.remove('beta');
    expect(list.items.value.map((item) => item.id)).toEqual(['delta', 'alpha', 'gamma']);

    list.setFilterText('ga');
    expect(list.items.value.map((item) => item.id)).toEqual(['gamma']);
  });

  it('matches vue-stately list move ordering semantics when move keys are missing', () => {
    let list = useStatelyListData({
      getKey: (item: {id: string}) => item.id,
      initialItems: [
        {id: 'one'},
        {id: 'two'},
        {id: 'three'}
      ]
    });

    list.moveBefore('three', ['missing']);
    expect(list.items.value.map((item) => item.id)).toEqual(['one', 'three', 'two']);

    list.moveAfter('one', ['still-missing']);
    expect(list.items.value.map((item) => item.id)).toEqual(['two', 'one', 'three']);
  });

  it('manages vue-stately tree data insertion, movement, selection, and removal', () => {
    type TreeItem = {children?: TreeItem[], id: string, label: string};
    let tree = useStatelyTreeData<TreeItem>({
      getChildren: (item) => item.children ?? [],
      getKey: (item) => item.id,
      initialItems: [
        {
          id: 'root-1',
          label: 'Root 1',
          children: [{id: 'child-1', label: 'Child 1'}]
        },
        {id: 'root-2', label: 'Root 2'}
      ]
    });

    tree.append(null, {id: 'root-3', label: 'Root 3'});
    expect(tree.items.value.map((item) => item.key)).toEqual(['root-1', 'root-2', 'root-3']);
    expect(tree.getItem('child-1')?.parentKey).toBe('root-1');

    tree.move('child-1', null, 0);
    expect(tree.items.value[0].key).toBe('child-1');
    expect(tree.getItem('child-1')?.parentKey).toBeNull();

    tree.setSelectedKeys(['root-2', 'root-3']);
    tree.removeSelectedItems();
    expect(tree.items.value.map((item) => item.key)).toEqual(['child-1', 'root-1']);
  });

  it('matches vue-stately tree moveBefore and moveAfter self-target semantics', () => {
    type TreeItem = {children?: TreeItem[], id: string};
    let createTree = () => useStatelyTreeData<TreeItem>({
      getChildren: (item) => item.children ?? [],
      getKey: (item) => item.id,
      initialItems: [
        {
          id: 'David',
          children: [
            {id: 'John', children: [{id: 'Suzie'}]},
            {id: 'Sam', children: [{id: 'Stacy'}, {id: 'Brad'}]},
            {id: 'Jane'}
          ]
        },
        {id: 'Emily'},
        {id: 'Eli'}
      ]
    });

    let treeBefore = createTree();
    treeBefore.moveBefore('David', ['David']);
    expect(treeBefore.items.value.map((item) => item.key)).toEqual(['David', 'Emily', 'Eli']);

    treeBefore.moveBefore('David', ['David', 'Eli']);
    expect(treeBefore.items.value.map((item) => item.key)).toEqual(['David', 'Eli', 'Emily']);

    treeBefore.moveBefore('John', ['John']);
    expect(treeBefore.getItem('David')?.children?.map((item) => item.key)).toEqual(['John', 'Sam', 'Jane']);

    treeBefore.moveBefore('Jane', ['Sam', 'Jane']);
    expect(treeBefore.getItem('David')?.children?.map((item) => item.key)).toEqual(['John', 'Sam', 'Jane']);

    let treeAfter = createTree();
    treeAfter.moveAfter('David', ['David']);
    expect(treeAfter.items.value.map((item) => item.key)).toEqual(['David', 'Emily', 'Eli']);

    treeAfter.moveAfter('David', ['David', 'Eli']);
    expect(treeAfter.items.value.map((item) => item.key)).toEqual(['David', 'Eli', 'Emily']);

    treeAfter.moveAfter('John', ['John']);
    expect(treeAfter.getItem('David')?.children?.map((item) => item.key)).toEqual(['John', 'Sam', 'Jane']);

    treeAfter.moveAfter('Jane', ['Sam', 'Jane']);
    expect(treeAfter.getItem('David')?.children?.map((item) => item.key)).toEqual(['John', 'Sam', 'Jane']);
  });

  it('throws when vue-stately tree moveBefore attempts to move a parent into its own subtree', () => {
    type TreeItem = {children?: TreeItem[], id: string};
    let tree = useStatelyTreeData<TreeItem>({
      getChildren: (item) => item.children ?? [],
      getKey: (item) => item.id,
      initialItems: [
        {
          id: 'David',
          children: [
            {id: 'John', children: [{id: 'Suzie'}]},
            {id: 'Sam'},
            {id: 'Jane'}
          ]
        },
        {id: 'Emily'},
        {id: 'Eli'}
      ]
    });

    expect(() => {
      tree.moveBefore('Suzie', ['John', 'Sam', 'Eli']);
    }).toThrow('Cannot move an item to be a child of itself.');
  });

  it('loads, paginates, and filters vue-stately async list data', async () => {
    let allItems = [
      {id: 'alpha', label: 'Alpha'},
      {id: 'beta', label: 'Beta'},
      {id: 'gamma', label: 'Gamma'}
    ];

    let asyncList = useStatelyAsyncList<typeof allItems[number], string>({
      getKey: (item) => item.id,
      load: async ({cursor, filterText}) => {
        let source = filterText
          ? allItems.filter((item) => item.label.toLowerCase().includes(filterText.toLowerCase()))
          : allItems;

        if (cursor === 'page-2') {
          return {
            items: source.slice(2),
            cursor: undefined
          };
        }

        return {
          items: source.slice(0, 2),
          cursor: source.length > 2 ? 'page-2' : undefined
        };
      }
    });

    await nextTick();
    await Promise.resolve();
    expect(asyncList.items.value.map((item) => item.id)).toEqual(['alpha', 'beta']);
    expect(asyncList.loadingState.value).toBe('idle');

    asyncList.loadMore();
    await nextTick();
    await Promise.resolve();
    expect(asyncList.items.value.map((item) => item.id)).toEqual(['alpha', 'beta', 'gamma']);

    asyncList.setFilterText('ga');
    await nextTick();
    await Promise.resolve();
    expect(asyncList.filterText.value).toBe('ga');
    expect(asyncList.items.value.map((item) => item.id)).toEqual(['gamma']);
  });

  it('matches vue-stately async list default getKey fallback semantics for falsy ids', async () => {
    let asyncList = useStatelyAsyncList<{id: number, key: string}>({
      load: async () => ({
        items: [{id: 0, key: 'zero-key'}]
      })
    });

    await nextTick();
    await Promise.resolve();

    expect(asyncList.getItem('zero-key')).toEqual({id: 0, key: 'zero-key'});

    asyncList.remove('zero-key');
    expect(asyncList.items.value).toEqual([]);
  });

  it('prevents vue-stately async list loadMore while initial load is in progress', async () => {
    vi.useFakeTimers();

    try {
      let load = vi.fn().mockImplementation(() => new Promise<{cursor: string, items: {id: number}[]}>((resolve) => {
        setTimeout(() => {
          resolve({
            items: [{id: 1}, {id: 2}],
            cursor: 'page-2'
          });
        }, 100);
      }));

      let asyncList = useStatelyAsyncList<{id: number}, string>({
        load
      });

      expect(asyncList.isLoading.value).toBe(true);
      asyncList.loadMore();
      expect(load).toHaveBeenCalledTimes(1);
      expect(asyncList.loadingState.value).toBe('loading');

      vi.runAllTimers();
      await Promise.resolve();

      expect(asyncList.isLoading.value).toBe(false);
      expect(asyncList.items.value.map((item) => item.id)).toEqual([1, 2]);
    } finally {
      vi.runAllTimers();
      vi.useRealTimers();
    }
  });

  it('handles vue-stately async list duplicate loadMore calls in quick succession', async () => {
    vi.useFakeTimers();

    try {
      let load = vi.fn()
        .mockImplementationOnce(() => new Promise<{cursor: string, items: {id: number}[]}>((resolve) => {
          setTimeout(() => {
            resolve({
              items: [{id: 1}, {id: 2}],
              cursor: 'page-2'
            });
          }, 100);
        }))
        .mockImplementationOnce(({signal}: {signal: AbortSignal}) => new Promise<{cursor: undefined, items: {id: number}[]}>((resolve, reject) => {
          signal.addEventListener('abort', () => {
            reject(new Error('aborted'));
          });

          setTimeout(() => {
            resolve({
              items: [{id: 3}, {id: 4}],
              cursor: undefined
            });
          }, 100);
        }))
        .mockImplementationOnce(() => new Promise<{cursor: undefined, items: {id: number}[]}>((resolve) => {
          setTimeout(() => {
            resolve({
              items: [{id: 999}],
              cursor: undefined
            });
          }, 100);
        }))
        .mockImplementationOnce(() => new Promise<{cursor: undefined, items: {id: number}[]}>((resolve) => {
          setTimeout(() => {
            resolve({
              items: [{id: 1000}],
              cursor: undefined
            });
          }, 100);
        }));

      let asyncList = useStatelyAsyncList<{id: number}, string>({
        load
      });

      vi.advanceTimersByTime(100);
      await Promise.resolve();

      expect(asyncList.items.value.map((item) => item.id)).toEqual([1, 2]);
      expect(asyncList.loadingState.value).toBe('idle');

      asyncList.loadMore();
      asyncList.loadMore();
      asyncList.loadMore();

      vi.runAllTimers();
      await Promise.resolve();

      // First loadMore wins; Vue drops subsequent calls synchronously.
      expect(asyncList.items.value.map((item) => item.id)).toEqual([1, 2, 3, 4]);
      expect(asyncList.loadingState.value).toBe('idle');
      expect(load).toHaveBeenCalledTimes(2);
    } finally {
      vi.runAllTimers();
      vi.useRealTimers();
    }
  });

  it('keeps vue-stately async list all-selection when removing last loaded item while cursor remains', async () => {
    let asyncList = useStatelyAsyncList<{id: string}, string>({
      getKey: (item) => item.id,
      load: async ({cursor}) => {
        if (cursor === 'page-2') {
          return {
            items: [{id: 'second'}],
            cursor: undefined
          };
        }

        return {
          items: [{id: 'first'}],
          cursor: 'page-2'
        };
      }
    });

    await nextTick();
    await Promise.resolve();

    asyncList.setSelectedKeys('all');
    asyncList.remove('first');

    expect(asyncList.items.value).toEqual([]);
    expect(asyncList.selectedKeys.value).toBe('all');
  });

  it('updates vue-stately async list filter text when load returns a new filter and refetches', async () => {
    vi.useFakeTimers();

    try {
      let filterItems = [{id: 10}, {id: 11}];
      let firstFilteredItems = [{id: 20}, {id: 21}];
      let secondFilteredItems = [{id: 30}, {id: 31}];
      let load = vi.fn()
        .mockImplementationOnce(() => new Promise((resolve) => {
          setTimeout(() => {
            resolve({items: filterItems});
          }, 100);
        }))
        .mockImplementationOnce(() => new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              items: firstFilteredItems,
              filterText: 'new text'
            });
          }, 100);
        }))
        .mockImplementationOnce(() => new Promise((resolve) => {
          setTimeout(() => {
            resolve({items: secondFilteredItems});
          }, 100);
        }));
      let asyncList = useStatelyAsyncList<{id: number}, string>({
        initialFilterText: 'Bo',
        load
      });

      expect(asyncList.loadingState.value).toBe('loading');
      expect(load).toHaveBeenCalledTimes(1);
      expect(asyncList.filterText.value).toBe('Bo');

      vi.advanceTimersByTime(100);
      await Promise.resolve();
      await Promise.resolve();
      expect(asyncList.loadingState.value).toBe('idle');
      expect(asyncList.items.value).toEqual(filterItems);
      expect(asyncList.filterText.value).toBe('Bo');

      asyncList.setFilterText('Jo');
      expect(asyncList.loadingState.value).toBe('filtering');
      expect(load).toHaveBeenCalledTimes(2);
      expect(asyncList.filterText.value).toBe('Jo');

      vi.advanceTimersByTime(100);
      await Promise.resolve();
      await Promise.resolve();

      expect(asyncList.loadingState.value).toBe('filtering');
      expect(load).toHaveBeenCalledTimes(3);
      expect(asyncList.items.value).toEqual(firstFilteredItems);
      expect(asyncList.filterText.value).toBe('new text');

      vi.advanceTimersByTime(100);
      await Promise.resolve();
      await Promise.resolve();

      expect(asyncList.loadingState.value).toBe('idle');
      expect(load).toHaveBeenCalledTimes(3);
      expect(asyncList.items.value).toEqual(secondFilteredItems);
      expect(asyncList.filterText.value).toBe('new text');
    } finally {
      vi.runAllTimers();
      vi.useRealTimers();
    }
  });

  it('clamps vue-aria date field and time field values within min/max bounds', () => {
    let dateValue = ref('2026-02-05');
    let dateField = useDateField({
      inputValue: dateValue,
      maxValue: '2026-02-20',
      minValue: '2026-02-01'
    });
    dateField.setValue('2026-03-01');
    expect(dateValue.value).toBe('2026-02-20');
    expect(dateField.isInvalid.value).toBe(false);

    let timeValue = ref('09:30');
    let timeField = useTimeField({
      inputValue: timeValue,
      maxValue: '10:00'
    });
    timeField.setValue('11:45');
    expect(timeValue.value).toBe('10:00');
  });

  it('updates vue-aria date picker and date range picker selection state', () => {
    let pickerOpenChanges: boolean[] = [];
    let pickerChanges: Array<string | null> = [];
    let pickerValue = ref<string | null>(null);
    let picker = useDatePicker({
      maxValue: '2026-02-28',
      minValue: '2026-02-01',
      onChange: (nextValue) => {
        pickerChanges.push(nextValue);
      },
      onOpenChange: (nextOpen) => {
        pickerOpenChanges.push(nextOpen);
      },
      value: pickerValue
    });

    picker.open();
    expect(picker.isOpen.value).toBe(true);
    picker.open();
    expect(pickerOpenChanges).toEqual([true]);
    picker.setValue('2026-03-10');
    expect(pickerValue.value).toBe('2026-02-28');
    picker.setValue('2026-03-10');
    expect(pickerChanges).toEqual(['2026-02-28']);
    picker.close();
    expect(picker.isOpen.value).toBe(false);
    picker.close();
    expect(pickerOpenChanges).toEqual([true, false]);
    picker.setValue(null);
    picker.setValue(null);
    expect(pickerChanges).toEqual(['2026-02-28', null]);

    let rangeOpenChanges: boolean[] = [];
    let rangeChanges: Array<{end: string | null, start: string | null}> = [];
    let rangeValue = ref({
      start: null as string | null,
      end: null as string | null
    });
    let rangePicker = useDateRangePicker({
      maxValue: '2026-02-28',
      minValue: '2026-02-01',
      onChange: (nextValue) => {
        rangeChanges.push({...nextValue});
      },
      onOpenChange: (nextOpen) => {
        rangeOpenChanges.push(nextOpen);
      },
      value: rangeValue
    });

    rangePicker.open();
    rangePicker.open();
    expect(rangeOpenChanges).toEqual([true]);
    rangePicker.close();
    rangePicker.close();
    expect(rangeOpenChanges).toEqual([true, false]);

    rangePicker.setStart('2026-02-20');
    rangePicker.setEnd('2026-03-10');
    expect(rangeValue.value).toEqual({
      start: '2026-02-20',
      end: '2026-02-28'
    });

    rangePicker.setRange({
      start: '2026-02-25',
      end: '2026-02-10'
    });
    expect(rangeValue.value).toEqual({
      start: '2026-02-25',
      end: '2026-02-25'
    });
    let rangeChangeCount = rangeChanges.length;
    rangePicker.setRange({
      start: '2026-02-25',
      end: '2026-02-25'
    });
    expect(rangeChanges.length).toBe(rangeChangeCount);
    expect(rangePicker.isInvalid.value).toBe(false);
  });

  it('manages vue-stately date and time field state', () => {
    let dateValue = ref('2026-02-10');
    let dateField = useStatelyDateFieldState({
      maxValue: '2026-02-20',
      minValue: '2026-02-01',
      onChange: (value) => {
        dateValue.value = value;
      },
      value: dateValue
    });

    dateField.increment();
    expect(dateValue.value).toBe('2026-02-11');
    dateField.decrement(2);
    expect(dateValue.value).toBe('2026-02-09');
    dateField.setValue('2026-03-01');
    expect(dateValue.value).toBe('2026-02-20');
    expect(dateField.validationState.value).toBeNull();

    let timeValue = ref('23:30');
    let timeField = useStatelyTimeFieldState({
      onChange: (value) => {
        timeValue.value = value;
      },
      value: timeValue
    });

    timeField.increment(90);
    expect(timeValue.value).toBe('01:00');
    timeField.decrement(60);
    expect(timeValue.value).toBe('00:00');
    timeField.clear();
    expect(timeValue.value).toBe('');
  });

  it('keeps vue-stately date and time field controlled without mutating control refs', () => {
    let dateValue = ref('2026-02-10');
    let dateChanges: string[] = [];
    let dateField = useStatelyDateFieldState({
      onChange: (value) => {
        dateChanges.push(value);
      },
      value: dateValue
    });

    dateField.increment();
    dateField.increment();
    expect(dateValue.value).toBe('2026-02-10');
    expect(dateChanges).toEqual(['2026-02-11']);

    let timeValue = ref('23:30');
    let timeChanges: string[] = [];
    let timeField = useStatelyTimeFieldState({
      onChange: (value) => {
        timeChanges.push(value);
      },
      value: timeValue
    });

    timeField.increment(90);
    timeField.increment(90);
    expect(timeValue.value).toBe('23:30');
    expect(timeChanges).toEqual(['01:00']);
  });

  it('manages vue-stately date picker open and selection state', () => {
    let pickerValue = ref<string | null>(null);
    let picker = useStatelyDatePickerState({
      onChange: (value) => {
        pickerValue.value = value;
      },
      value: pickerValue
    });

    picker.open();
    expect(picker.isOpen.value).toBe(true);

    picker.setDateValue('2026-02-22');
    expect(pickerValue.value).toBe('2026-02-22');
    expect(picker.isOpen.value).toBe(false);

    picker.setTimeValue('09:45');
    picker.commit();
    expect(picker.timeValue.value).toBe('09:45');
    expect(picker.formatValue()).toBe('2026-02-22');
  });

  it('manages vue-stately date range picker date and time range state', () => {
    let rangeValue = ref({
      start: null as string | null,
      end: null as string | null
    });

    let rangePicker = useStatelyDateRangePickerState({
      onChange: (value) => {
        rangeValue.value = {
          start: value.start,
          end: value.end
        };
      },
      value: rangeValue
    });

    rangePicker.open();
    expect(rangePicker.isOpen.value).toBe(true);

    rangePicker.setDate('start', '2026-02-20');
    rangePicker.setDate('end', '2026-02-10');
    expect(rangeValue.value).toEqual({
      start: '2026-02-20',
      end: '2026-02-20'
    });

    rangePicker.setDateRange({
      start: '2026-02-21',
      end: '2026-02-24'
    });
    expect(rangePicker.isOpen.value).toBe(false);

    rangePicker.setTime('start', '08:30');
    rangePicker.setTime('end', '18:15');
    expect(rangePicker.timeRange.value).toEqual({
      start: '08:30',
      end: '18:15'
    });
    expect(rangePicker.formatValue()).toEqual({
      start: '2026-02-21',
      end: '2026-02-24'
    });
  });

  it('keeps vue-stately date picker and date range picker controlled without mutating control refs', () => {
    let pickerValue = ref<string | null>(null);
    let pickerChanges: Array<string | null> = [];
    let picker = useStatelyDatePickerState({
      onChange: (value) => {
        pickerChanges.push(value);
      },
      value: pickerValue
    });

    picker.setDateValue('2026-02-22');
    picker.setDateValue('2026-02-22');
    expect(pickerValue.value).toBeNull();
    expect(picker.dateValue.value).toBeNull();
    expect(pickerChanges).toEqual(['2026-02-22']);

    let rangeValue = ref({
      start: null as string | null,
      end: null as string | null
    });
    let rangeChanges: Array<{end: string | null, start: string | null}> = [];
    let rangePicker = useStatelyDateRangePickerState({
      onChange: (value) => {
        rangeChanges.push({
          start: value.start,
          end: value.end
        });
      },
      value: rangeValue
    });

    rangePicker.setDateRange({
      start: '2026-02-21',
      end: '2026-02-24'
    });
    expect(rangeValue.value).toEqual({
      start: null,
      end: null
    });
    expect(rangePicker.dateRange.value).toEqual({
      start: null,
      end: null
    });
    expect(rangeChanges).toEqual([{
      start: '2026-02-21',
      end: '2026-02-24'
    }]);
  });

  it('manages vue-aria dialog labeling and open state', () => {
    let openChanges: boolean[] = [];
    let dialog = useAriaDialog({
      ariaDescribedby: 'starter-dialog-description',
      onOpenChange: (isOpen) => {
        openChanges.push(isOpen);
      }
    });

    expect(dialog.dialogProps.value.role).toBe('dialog');
    expect(dialog.dialogProps.value.hidden).toBe(true);
    expect(dialog.dialogProps.value['aria-labelledby']).toBe(dialog.titleProps.value.id);

    dialog.open();
    expect(dialog.isOpen.value).toBe(true);
    expect(dialog.dialogProps.value.hidden).toBe(false);
    dialog.open();
    expect(openChanges).toEqual([true]);
    dialog.toggle();
    expect(dialog.isOpen.value).toBe(false);
    expect(openChanges).toEqual([true, false]);
  });

  it('keeps non-dismissable vue-aria dialog open when close is requested', () => {
    let dialog = useAriaDialog({
      ariaLabel: 'Critical alert',
      defaultOpen: true,
      isDismissable: false,
      role: 'alertdialog'
    });

    dialog.close();
    expect(dialog.isOpen.value).toBe(true);
    expect(dialog.dialogProps.value.role).toBe('alertdialog');
    expect(dialog.dialogProps.value['aria-label']).toBe('Critical alert');
  });

  it('toggles vue-aria disclosure expanded state and panel visibility', () => {
    let changes: boolean[] = [];
    let disclosure = useAriaDisclosure({
      onExpandedChange: (nextExpanded) => {
        changes.push(nextExpanded);
      }
    });
    expect(disclosure.isExpanded.value).toBe(false);
    expect(disclosure.panelProps.value.hidden).toBe(true);

    disclosure.toggle();
    expect(disclosure.isExpanded.value).toBe(true);
    expect(disclosure.buttonProps.value['aria-expanded']).toBe(true);
    expect(disclosure.panelProps.value.hidden).toBe(false);

    disclosure.collapse();
    expect(disclosure.isExpanded.value).toBe(false);
    disclosure.collapse();
    expect(changes).toEqual([true, false]);
  });

  it('preserves controlled disclosure state when disabled', () => {
    let expanded = ref(true);
    let changes: boolean[] = [];
    let disclosure = useAriaDisclosure({
      isDisabled: true,
      isExpanded: expanded,
      onExpandedChange: (nextExpanded) => {
        changes.push(nextExpanded);
      }
    });

    disclosure.toggle();
    expect(expanded.value).toBe(true);
    expect(disclosure.buttonProps.value.disabled).toBe(true);
    expect(changes).toEqual([]);
  });

  it('manages vue-stately disclosure expansion state transitions', () => {
    let expanded = ref(false);
    let changes: boolean[] = [];
    let disclosure = useStatelyDisclosureState({
      isExpanded: expanded,
      onExpandedChange: (isExpanded) => {
        changes.push(isExpanded);
        expanded.value = isExpanded;
      }
    });

    expect(disclosure.isExpanded.value).toBe(false);
    disclosure.expand();
    expect(expanded.value).toBe(true);
    disclosure.toggle();
    expect(expanded.value).toBe(false);
    disclosure.collapse();
    expect(expanded.value).toBe(false);
    expect(changes).toEqual([true, false]);
  });

  it('keeps vue-stately disclosure hooks controlled without mutating control refs', () => {
    let expanded = ref(false);
    let expansionChanges: boolean[] = [];
    let disclosure = useStatelyDisclosureState({
      isExpanded: expanded,
      onExpandedChange: (isExpanded) => {
        expansionChanges.push(isExpanded);
      }
    });

    disclosure.expand();
    disclosure.expand();
    expect(expanded.value).toBe(false);
    expect(disclosure.isExpanded.value).toBe(false);
    expect(expansionChanges).toEqual([true]);

    let expandedKeys = ref<Set<string | number> | undefined>(new Set(['alpha']));
    let groupChanges: string[][] = [];
    let disclosureGroup = useStatelyDisclosureGroupState({
      expandedKeys,
      onExpandedChange: (keys) => {
        groupChanges.push(Array.from(keys).map((key) => String(key)));
      }
    });

    disclosureGroup.toggleKey('beta');
    expect(Array.from(expandedKeys.value ?? [])).toEqual(['alpha']);
    expect(Array.from(disclosureGroup.expandedKeys.value)).toEqual(['alpha']);
    expect(groupChanges).toEqual([['beta']]);
  });

  it('suppresses duplicate vue-stately disclosure-group controlled callbacks for the same update in one turn', () => {
    let expandedKeys = ref<Set<string | number> | undefined>(new Set(['alpha']));
    let groupChanges: string[][] = [];
    let disclosureGroup = useStatelyDisclosureGroupState({
      expandedKeys,
      onExpandedChange: (keys) => {
        groupChanges.push(Array.from(keys).map((key) => String(key)));
      }
    });

    let requestedKeys = new Set<string | number>(['beta']);
    disclosureGroup.setExpandedKeys(requestedKeys);
    disclosureGroup.setExpandedKeys(requestedKeys);

    expect(Array.from(expandedKeys.value ?? [])).toEqual(['alpha']);
    expect(Array.from(disclosureGroup.expandedKeys.value)).toEqual(['alpha']);
    expect(groupChanges).toEqual([['beta']]);
  });

  it('manages vue-stately disclosure group expanded keys for single and multiple modes', () => {
    let singleGroup = useStatelyDisclosureGroupState();
    singleGroup.toggleKey('alpha');
    expect(Array.from(singleGroup.expandedKeys.value)).toEqual(['alpha']);
    singleGroup.toggleKey('beta');
    expect(Array.from(singleGroup.expandedKeys.value)).toEqual(['beta']);
    singleGroup.toggleKey('beta');
    expect(Array.from(singleGroup.expandedKeys.value)).toEqual([]);

    let multipleGroup = useStatelyDisclosureGroupState({
      allowsMultipleExpanded: true,
      defaultExpandedKeys: ['one']
    });
    multipleGroup.toggleKey('two');
    expect(Array.from(multipleGroup.expandedKeys.value)).toEqual(['one', 'two']);
    multipleGroup.toggleKey('one');
    expect(Array.from(multipleGroup.expandedKeys.value)).toEqual(['two']);
  });

  it('matches vue-stately disclosure group expanded-set identity semantics', () => {
    let expandedChanges: string[][] = [];
    let group = useStatelyDisclosureGroupState({
      allowsMultipleExpanded: true,
      defaultExpandedKeys: ['alpha'],
      onExpandedChange: (keys) => {
        expandedChanges.push(Array.from(keys).map((key) => String(key)));
      }
    });

    let sameSetRef = group.expandedKeys.value;
    group.setExpandedKeys(sameSetRef);
    expect(expandedChanges).toEqual([]);

    group.setExpandedKeys(new Set(['alpha']));
    expect(expandedChanges).toEqual([['alpha']]);
  });

  it('matches vue-stately disclosure group disabled and single-mode setter semantics with React', async () => {
    let disabledGroup = useStatelyDisclosureGroupState({
      isDisabled: true
    });

    disabledGroup.toggleKey('alpha');
    expect(Array.from(disabledGroup.expandedKeys.value)).toEqual(['alpha']);

    let expandedChanges: string[][] = [];
    let singleGroup = useStatelyDisclosureGroupState({
      onExpandedChange: (keys) => {
        expandedChanges.push(Array.from(keys).map((key) => String(key)));
      }
    });

    singleGroup.setExpandedKeys(new Set(['alpha', 'beta']));
    await nextTick();

    expect(expandedChanges).toEqual([['alpha', 'beta'], ['alpha']]);
    expect(Array.from(singleGroup.expandedKeys.value)).toEqual(['alpha']);
  });

  it('warns when vue-stately disclosure hooks switch between controlled and uncontrolled', async () => {
    let warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    try {
      let overlayOpen = ref<boolean | undefined>(true);
      useStatelyOverlayTriggerState({
        isOpen: overlayOpen
      });

      overlayOpen.value = undefined;
      await nextTick();
      expect(warnSpy).toHaveBeenLastCalledWith('WARN: A component changed from controlled to uncontrolled.');

      overlayOpen.value = false;
      await nextTick();
      expect(warnSpy).toHaveBeenLastCalledWith('WARN: A component changed from uncontrolled to controlled.');

      let disclosureExpanded = ref<boolean | undefined>(true);
      useStatelyDisclosureState({
        isExpanded: disclosureExpanded
      });

      disclosureExpanded.value = undefined;
      await nextTick();
      expect(warnSpy).toHaveBeenLastCalledWith('WARN: A component changed from controlled to uncontrolled.');

      disclosureExpanded.value = false;
      await nextTick();
      expect(warnSpy).toHaveBeenLastCalledWith('WARN: A component changed from uncontrolled to controlled.');

      let disclosureExpandedKeys = ref<Set<string> | undefined>(new Set(['alpha']));
      useStatelyDisclosureGroupState({
        expandedKeys: disclosureExpandedKeys
      });

      disclosureExpandedKeys.value = undefined;
      await nextTick();
      expect(warnSpy).toHaveBeenLastCalledWith('WARN: A component changed from controlled to uncontrolled.');

      disclosureExpandedKeys.value = new Set(['beta']);
      await nextTick();
      expect(warnSpy).toHaveBeenLastCalledWith('WARN: A component changed from uncontrolled to controlled.');
    } finally {
      warnSpy.mockRestore();
    }
  });

  it('keeps vue-stately overlay and disclosure hooks uncontrolled when control refs are undefined', () => {
    let overlayOpen = ref<boolean | undefined>(undefined);
    let overlayState = useStatelyOverlayTriggerState({
      defaultOpen: false,
      isOpen: overlayOpen
    });

    overlayState.open();
    expect(overlayOpen.value).toBeUndefined();
    expect(overlayState.isOpen.value).toBe(true);

    let disclosureExpanded = ref<boolean | undefined>(undefined);
    let disclosureState = useStatelyDisclosureState({
      defaultExpanded: false,
      isExpanded: disclosureExpanded
    });

    disclosureState.expand();
    expect(disclosureExpanded.value).toBeUndefined();
    expect(disclosureState.isExpanded.value).toBe(true);

    let disclosureExpandedKeys = ref<Set<string> | undefined>(undefined);
    let disclosureGroupState = useStatelyDisclosureGroupState({
      allowsMultipleExpanded: true,
      defaultExpandedKeys: ['alpha'],
      expandedKeys: disclosureExpandedKeys
    });

    disclosureGroupState.toggleKey('beta');
    expect(disclosureExpandedKeys.value).toBeUndefined();
    expect(Array.from(disclosureGroupState.expandedKeys.value).sort()).toEqual(['alpha', 'beta']);
  });

  it('tracks vue-aria dnd drag lifecycle callbacks and operation state', () => {
    let warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    let dragEvents: Array<string> = [];
    let drag = useDrag({
      dragItems: [{id: 'ticket-1', type: 'ticket', value: {id: 1}}],
      onDragEnd: (operation) => {
        dragEvents.push(`end:${operation}`);
      },
      onDragMove: (point) => {
        dragEvents.push(`move:${point.x},${point.y}`);
      },
      onDragStart: () => {
        dragEvents.push('start');
      }
    });

    drag.startDrag();
    drag.moveDrag({x: 40, y: 88});
    drag.endDrag('move');

    expect(drag.isDragging.value).toBe(false);
    expect(drag.lastDropOperation.value).toBe('move');
    expect(dragEvents).toEqual(['start', 'move:40,88', 'end:move']);
    expect(warnSpy).toHaveBeenCalledWith('Drags initiated from the React Aria useDrag hook may only be dropped on a target created with useDrop. This ensures that a keyboard and screen reader accessible alternative is available.');
    warnSpy.mockRestore();
  });

  it('does not warn when vue-aria drags end via a useDrop target', () => {
    let warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    let drag = useDrag({
      dragItems: [{id: 'ticket-3', type: 'ticket', value: {id: 3}}]
    });
    let drop = useDrop({
      acceptedDragTypes: ['ticket']
    });

    drag.startDrag();
    expect(drop.enter(drag.dragItems.value)).toBe(true);
    let operation = drop.drop(drag.dragItems.value, 'copy');
    drag.endDrag(operation);

    expect(warnSpy).not.toHaveBeenCalledWith('Drags initiated from the React Aria useDrag hook may only be dropped on a target created with useDrop. This ensures that a keyboard and screen reader accessible alternative is available.');
    warnSpy.mockRestore();
  });

  it('filters vue-aria dnd drops by accepted drag types', () => {
    let dropEvents: Array<string> = [];
    let drop = useDrop({
      acceptedDragTypes: ['ticket'],
      onDrop: (_items, operation) => {
        dropEvents.push(`drop:${operation}`);
      },
      onDropEnter: () => {
        dropEvents.push('enter');
      }
    });

    let ticketItems = [{id: 'ticket-2', type: 'ticket', value: {id: 2}}];
    let fileItems = [{id: 'asset-1', type: 'file', value: {name: 'spec.pdf'}}];

    expect(drop.enter(ticketItems)).toBe(true);
    expect(drop.drop(ticketItems, 'copy')).toBe('copy');
    expect(drop.lastDropOperation.value).toBe('copy');
    expect(drop.enter(fileItems)).toBe(false);
    expect(drop.drop(fileItems)).toBe('cancel');
    expect(dropEvents).toEqual(['enter', 'drop:copy']);
  });

  it('manages vue-stately draggable collection keys and drag lifecycle', () => {
    let warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    let dragEvents: Array<string> = [];
    let selectedKeys = ref(new Set<string>(['alpha', 'beta']));
    let draggable = useStatelyDraggableCollectionState({
      collection: [
        {key: 'alpha', value: {id: 1, label: 'Alpha'}},
        {key: 'beta', value: {id: 2, label: 'Beta'}},
        {key: 'beta-child', parentKey: 'beta', value: {id: 3, label: 'Beta child'}}
      ],
      onDragEnd: (event) => {
        dragEvents.push(`end:${event.operation}:${Array.from(event.keys).join(',')}`);
      },
      onDragStart: (event) => {
        dragEvents.push(`start:${Array.from(event.keys).join(',')}`);
      },
      selectedKeys
    });

    expect(Array.from(draggable.getKeysForDrag('beta'))).toEqual(['alpha', 'beta']);
    draggable.startDrag('beta');
    expect(draggable.isDragging('alpha')).toBe(true);
    expect(draggable.draggedKey.value).toBe('beta');

    draggable.endDrag('move');
    expect(draggable.draggingKeys.value.size).toBe(0);
    expect(draggable.draggedKey.value).toBeNull();
    expect(dragEvents).toEqual(['start:alpha,beta', 'end:move:alpha,beta']);
    expect(warnSpy).toHaveBeenCalledWith('Drags initiated from the React Aria useDrag hook may only be dropped on a target created with useDrop. This ensures that a keyboard and screen reader accessible alternative is available.');
    warnSpy.mockRestore();
  });

  it('manages vue-stately droppable collection target and operation resolution', () => {
    let dropEvents: Array<string> = [];
    let droppable = useStatelyDroppableCollectionState({
      acceptedDragTypes: ['ticket'],
      getDropOperation: ({target}) => {
        return target?.type === 'item' ? 'move' : 'copy';
      },
      onDrop: (event) => {
        dropEvents.push(`drop:${event.operation}`);
      }
    });

    let dropTarget = {
      type: 'item' as const,
      key: 'ticket-1',
      dropPosition: 'on' as const
    };
    droppable.setTarget(dropTarget);
    expect(droppable.isDropTarget(dropTarget)).toBe(true);

    let items = [{id: 'ticket-1', type: 'ticket', value: {id: 1}}];
    expect(droppable.enter(items)).toBe(true);
    expect(droppable.drop(items)).toBe('move');
    expect(dropEvents).toEqual(['drop:move']);
  });

  it('toggles vue-stately global feature flags', () => {
    expect(statelyTableNestedRows()).toBe(false);
    expect(statelyShadowDOM()).toBe(false);

    enableStatelyTableNestedRows();
    enableStatelyShadowDOM();

    expect(statelyTableNestedRows()).toBe(true);
    expect(statelyShadowDOM()).toBe(true);
  });

  it('computes vue-aria example theme class and color scheme metadata', () => {
    let colorScheme = ref<'dark' | 'light' | 'system'>('dark');
    let theme = useExampleTheme({
      colorScheme
    });

    expect(theme.colorScheme.value).toBe('dark');
    expect(theme.rootProps.value.class).toBe(EXAMPLE_THEME_CLASS);
    expect(theme.rootProps.value['data-theme']).toBe('dark');

    colorScheme.value = 'light';
    expect(theme.rootProps.value['data-theme']).toBe('light');
  });

  it('appends custom class names in vue-aria example theme root props', () => {
    let theme = useExampleTheme({
      rootClassName: ref('starter-shell')
    });

    expect(theme.rootProps.value.class).toBe(`${EXAMPLE_THEME_CLASS} starter-shell`);
    expect(theme.rootProps.value['data-theme']).toBe('system');
  });

  it('tracks vue-aria focus ring modality for direct and within focus flows', () => {
    let focusRing = useFocusRing();
    window.dispatchEvent(new MouseEvent('mousedown', {bubbles: true}));
    focusRing.focusProps.value.onFocus?.(new FocusEvent('focus'));
    expect(focusRing.isFocused.value).toBe(true);
    expect(focusRing.isFocusVisible.value).toBe(false);

    window.dispatchEvent(new KeyboardEvent('keydown', {key: 'Tab'}));
    focusRing.focusProps.value.onBlur?.(new FocusEvent('blur'));
    focusRing.focusProps.value.onFocus?.(new FocusEvent('focus'));
    expect(focusRing.isFocusVisible.value).toBe(true);

    let withinFocusRing = useFocusRing({within: true});
    withinFocusRing.focusProps.value.onFocusin?.(new FocusEvent('focusin'));
    expect(withinFocusRing.isFocused.value).toBe(true);
    withinFocusRing.focusProps.value.onFocusout?.(new FocusEvent('focusout'));
    expect(withinFocusRing.isFocused.value).toBe(false);
  });

  it('treats virtual clicks as vue-aria virtual modality for focus-visible state', () => {
    let focusVisible = useFocusVisible();
    setInteractionModality('pointer');
    expect(focusVisible.isFocusVisible.value).toBe(false);

    document.body.dispatchEvent(new MouseEvent('click', {bubbles: true, detail: 0}));
    expect(focusVisible.isFocusVisible.value).toBe(true);
  });

  it('tears down vue-aria focus-visible listeners on iframe beforeunload', () => {
    let focusVisible = useFocusVisible();
    let iframe = document.createElement('iframe');
    document.body.appendChild(iframe);
    let iframeWindow = iframe.contentWindow;
    let iframeDocument = iframe.contentWindow?.document;
    expect(iframeWindow).toBeTruthy();
    expect(iframeDocument).toBeTruthy();
    let root = iframeDocument!.createElement('div');
    iframeDocument!.body.appendChild(root);

    try {
      addWindowFocusTracking(root);

      setInteractionModality('keyboard');
      expect(focusVisible.isFocusVisible.value).toBe(true);
      if (typeof iframeWindow!.PointerEvent !== 'undefined') {
        iframeDocument!.body.dispatchEvent(new iframeWindow!.PointerEvent('pointerdown', {bubbles: true, pointerType: 'mouse'}));
      } else {
        iframeDocument!.body.dispatchEvent(new MouseEvent('mousedown', {bubbles: true}));
      }
      expect(focusVisible.isFocusVisible.value).toBe(false);

      setInteractionModality('keyboard');
      iframeWindow!.dispatchEvent(new Event('beforeunload'));
      expect(focusVisible.isFocusVisible.value).toBe(true);
      if (typeof iframeWindow!.PointerEvent !== 'undefined') {
        iframeDocument!.body.dispatchEvent(new iframeWindow!.PointerEvent('pointerdown', {bubbles: true, pointerType: 'mouse'}));
      } else {
        iframeDocument!.body.dispatchEvent(new MouseEvent('mousedown', {bubbles: true}));
      }
      expect(focusVisible.isFocusVisible.value).toBe(true);
    } finally {
      iframe.remove();
    }
  });

  it('cleans up vue-aria reactive interaction-modality handlers when scope is disposed', () => {
    setInteractionModality('keyboard');
    let scope = effectScope();
    let modality: {value: 'keyboard' | 'pointer' | 'virtual' | null} | null = null;
    scope.run(() => {
      modality = useInteractionModality({reactive: true}) as {value: 'keyboard' | 'pointer' | 'virtual' | null};
    });

    expect(modality?.value).toBe('keyboard');
    scope.stop();
    setInteractionModality('pointer');
    expect(modality?.value).toBe('keyboard');
  });

  it('detects vue-aria tabbable child state and updates after mutations', async () => {
    let container = document.createElement('div');
    let containerRef = ref<Element | null>(container);
    let hasTabbableChild = useHasTabbableChild(containerRef);

    expect(hasTabbableChild.value).toBe(false);

    let childButton = document.createElement('button');
    container.append(childButton);
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(hasTabbableChild.value).toBe(true);

    childButton.setAttribute('disabled', 'true');
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(hasTabbableChild.value).toBe(false);

    let disabledResult = useHasTabbableChild(containerRef, {isDisabled: true});
    expect(disabledResult.value).toBe(false);
  });

  it('applies vue-aria form validation handlers for native validation flows', () => {
    let commitCount = 0;
    let resetCount = 0;
    let focusCount = 0;
    let validation = useFormValidation({
      focus: () => {
        focusCount += 1;
      },
      isInvalid: true,
      onCommitValidation: () => {
        commitCount += 1;
      },
      onResetValidation: () => {
        resetCount += 1;
      },
      validationBehavior: 'native',
      validationErrors: ['Value is required']
    });

    let form = document.createElement('form');
    let input = document.createElement('input');
    form.append(input);
    document.body.append(form);

    try {
      let detach = validation.attach(input);
      expect(input.validationMessage).toBe('Value is required');

      input.dispatchEvent(new Event('change', {bubbles: true}));
      expect(commitCount).toBe(1);

      input.dispatchEvent(new Event('invalid', {cancelable: true}));
      expect(commitCount).toBe(2);
      expect(focusCount).toBe(1);

      form.dispatchEvent(new Event('reset'));
      expect(resetCount).toBe(1);

      detach();
    } finally {
      document.body.removeChild(form);
    }
  });

  it('manages vue-stately form validation state lifecycle and merge behavior', () => {
    let value = ref('bad');
    let state = useStatelyFormValidationState({
      validate: (nextValue) => {
        return nextValue === 'ok' ? undefined : 'Must be ok';
      },
      validationBehavior: ref<'native' | 'aria'>('native'),
      value
    });

    expect(state.realtimeValidation.value.isInvalid).toBe(true);
    expect(state.displayValidation.value.isInvalid).toBe(false);

    state.commitValidation();
    expect(state.displayValidation.value.isInvalid).toBe(true);
    expect(state.displayValidation.value.validationErrors).toEqual(['Must be ok']);

    state.resetValidation();
    expect(state.displayValidation.value).toEqual(DEFAULT_STATELY_VALIDATION_RESULT);

    let mergedValidation = mergeStatelyValidation(
      DEFAULT_STATELY_VALIDATION_RESULT,
      {
        isInvalid: true,
        validationErrors: ['Server error'],
        validationDetails: {
          ...DEFAULT_STATELY_VALIDATION_RESULT.validationDetails,
          customError: true,
          valid: false
        }
      }
    );
    expect(mergedValidation.isInvalid).toBe(true);
    expect(mergedValidation.validationErrors).toEqual(['Server error']);
  });

  it('clears and re-shows vue-stately form server validation errors on commit/reset', async () => {
    let validationErrors = ref<Record<string, string[]>>({
      field: ['Server error']
    });
    let state = useStatelyFormValidationState({
      name: 'field',
      validationBehavior: ref<'aria' | 'native'>('aria'),
      validationErrors,
      value: ref('hello')
    });

    expect(state.displayValidation.value.validationErrors).toEqual(['Server error']);

    state.commitValidation();
    expect(state.displayValidation.value.validationErrors).toEqual([]);

    validationErrors.value = {field: ['Next server error']};
    await nextTick();
    expect(state.displayValidation.value.validationErrors).toEqual(['Next server error']);

    state.resetValidation();
    expect(state.displayValidation.value.validationErrors).toEqual([]);
  });

  it('manages vue-stately grid collection and row/cell focus-selection state', () => {
    let collection = new StatelyGridCollection({
      columnCount: 2,
      items: [
        {
          key: 'row-1',
          textValue: 'Backlog',
          childNodes: [
            {key: 'row-1-cell-1', textValue: 'Backlog'},
            {key: 'row-1-cell-2', textValue: 'Open'}
          ]
        },
        {
          key: 'row-2',
          textValue: 'Done',
          childNodes: [
            {key: 'row-2-cell-1', textValue: 'Done'},
            {key: 'row-2-cell-2', textValue: 'Closed'}
          ]
        }
      ]
    });

    let selectedKeys = ref(new Set<string>());
    let selectionChanges: string[][] = [];
    let gridState = useStatelyGridState({
      collection,
      disabledKeys: ['row-2'],
      focusMode: 'cell',
      onSelectionChange: (keys) => {
        selectionChanges.push(Array.from(keys) as string[]);
        selectedKeys.value = new Set(keys);
      },
      selectedKeys,
      selectionMode: 'multiple'
    });

    expect(collection.getFirstKey()).toBe('row-1');
    expect(collection.getKeyAfter('row-1')).toBe('row-2');
    expect(collection.getItem('row-1-cell-1')?.parentKey).toBe('row-1');

    gridState.selectionManager.setFocusedKey('row-1', 'last');
    expect(gridState.selectionManager.focusedKey.value).toBe('row-1-cell-2');
    expect(gridState.selectionManager.isDisabled('row-2')).toBe(true);

    gridState.selectionManager.toggleSelection('row-1');
    expect(Array.from(gridState.selectionManager.selectedKeys.value)).toEqual(['row-1']);
    gridState.selectionManager.toggleSelection('row-2');
    expect(Array.from(gridState.selectionManager.selectedKeys.value)).toEqual(['row-1']);
    expect(selectionChanges).toEqual([['row-1']]);
  });

  it('keeps vue-stately grid controlled without mutating selected key refs', () => {
    let collection = new StatelyGridCollection({
      columnCount: 2,
      items: [
        {
          key: 'row-1',
          textValue: 'Backlog',
          childNodes: [
            {key: 'row-1-cell-1', textValue: 'Backlog'},
            {key: 'row-1-cell-2', textValue: 'Open'}
          ]
        },
        {
          key: 'row-2',
          textValue: 'Done',
          childNodes: [
            {key: 'row-2-cell-1', textValue: 'Done'},
            {key: 'row-2-cell-2', textValue: 'Closed'}
          ]
        }
      ]
    });

    let selectedKeys = ref(new Set<string>(['row-1']));
    let selectionChanges: string[][] = [];
    let gridState = useStatelyGridState({
      collection,
      onSelectionChange: (keys) => {
        selectionChanges.push(Array.from(keys) as string[]);
      },
      selectedKeys,
      selectionMode: 'multiple'
    });

    gridState.selectionManager.toggleSelection('row-2');

    expect(Array.from(selectedKeys.value)).toEqual(['row-1']);
    expect(Array.from(gridState.selectionManager.selectedKeys.value)).toEqual(['row-1']);
    expect(selectionChanges).toEqual([['row-1', 'row-2']]);
  });

  it('repositions vue-stately grid focus when the focused row is removed from collection', async () => {
    let options = reactive({
      collection: new StatelyGridCollection({
        columnCount: 2,
        items: [
          {
            key: 'row-1',
            childNodes: [
              {key: 'row-1-cell-1', textValue: 'Backlog'},
              {key: 'row-1-cell-2', textValue: 'Open'}
            ]
          },
          {
            key: 'row-2',
            childNodes: [
              {key: 'row-2-cell-1', textValue: 'In progress'},
              {key: 'row-2-cell-2', textValue: 'Pending'}
            ]
          },
          {
            key: 'row-3',
            childNodes: [
              {key: 'row-3-cell-1', textValue: 'Done'},
              {key: 'row-3-cell-2', textValue: 'Closed'}
            ]
          }
        ]
      }),
      disabledKeys: ['row-3'],
      focusMode: 'cell' as const,
      selectionMode: 'multiple' as const
    });

    let gridState = useStatelyGridState(options);
    gridState.selectionManager.setFocusedKey('row-2-cell-2');
    expect(gridState.selectionManager.focusedKey.value).toBe('row-2-cell-2');

    options.collection = new StatelyGridCollection({
      columnCount: 2,
      items: [
        {
          key: 'row-1',
          childNodes: [
            {key: 'row-1-cell-1', textValue: 'Backlog'},
            {key: 'row-1-cell-2', textValue: 'Open'}
          ]
        },
        {
          key: 'row-3',
          childNodes: [
            {key: 'row-3-cell-1', textValue: 'Done'},
            {key: 'row-3-cell-2', textValue: 'Closed'}
          ]
        }
      ]
    });

    await nextTick();
    expect(gridState.selectionManager.focusedKey.value).toBe('row-1-cell-2');
  });

  it('computes vue-stately list/grid/table/waterfall layout baselines', () => {
    let items = [
      {key: 'item-1', index: 0, type: 'item'},
      {key: 'item-2', index: 1, type: 'item'},
      {key: 'item-3', index: 2, type: 'loader'}
    ];

    let listLayout = new StatelyListLayout({gap: 4, rowHeight: 40});
    listLayout.update(items, 320);
    expect(listLayout.getLayoutInfo('item-1')?.rect.height).toBe(40);
    expect(listLayout.getVisibleLayoutInfos({x: 0, y: 0, width: 320, height: 120})).toHaveLength(3);

    let gridLayout = new StatelyGridLayout({gap: 8, minColumnWidth: 100, rowHeight: 50});
    gridLayout.update(items, 360);
    expect(gridLayout.getLayoutInfo('item-1')?.rect.width).toBeGreaterThan(0);
    expect(gridLayout.getContentSize().height).toBeGreaterThan(0);

    let tableLayout = new StatelyTableLayout({
      columnWidths: new Map([
        ['status', 180]
      ])
    });
    expect(tableLayout.getColumnWidth('status', 120)).toBe(180);
    expect(tableLayout.getColumnWidth('summary', 120)).toBe(120);

    let waterfallLayout = new StatelyWaterfallLayout({gap: 12, minColumnWidth: 120, rowHeight: 60});
    waterfallLayout.update(items, 420);
    expect(waterfallLayout.getLayoutInfo('item-2')).not.toBeNull();
  });

  it('manages vue-stately list collection selection and filtered focus state', () => {
    let nodes: StatelyListNode<{label: string}>[] = [
      {key: 'item-1', textValue: 'Vue', type: 'item', value: {label: 'Vue'}},
      {key: 'item-2', textValue: 'React', type: 'item', value: {label: 'React'}},
      {key: 'item-3', textValue: 'Svelte', type: 'item', value: {label: 'Svelte'}}
    ];

    let collection = new StatelyListCollection(nodes);
    let selectedKeys = ref(new Set<string>(['item-2']));
    let selectionChanges: string[][] = [];
    let listState = useStatelyListState({
      collection,
      disabledKeys: ['item-3'],
      selectedKeys,
      selectionMode: 'multiple',
      onSelectionChange: (keys) => {
        selectionChanges.push(Array.from(keys) as string[]);
      }
    });

    expect(listState.collection.getFirstKey()).toBe('item-1');
    expect(listState.collection.getKeyAfter('item-1')).toBe('item-2');
    expect(listState.collection.size).toBe(3);

    listState.selectionManager.toggleSelection('item-1');
    expect(Array.from(listState.selectionManager.selectedKeys.value)).toEqual(['item-2', 'item-1']);
    listState.selectionManager.toggleSelection('item-3');
    expect(Array.from(listState.selectionManager.selectedKeys.value)).toEqual(['item-2', 'item-1']);

    listState.selectionManager.setFocusedKey('item-2');
    let filteredState = useStatelyFilteredListState(listState, (textValue) => {
      return textValue.toLowerCase().includes('vue');
    });

    expect(Array.from(filteredState.collection.getKeys())).toEqual(['item-1']);
    expect(filteredState.selectionManager.focusedKey.value).toBe('item-1');
    expect(filteredState.selectionManager.isSelected('item-2')).toBe(false);
    expect(selectionChanges.length).toBeGreaterThan(0);
  });

  it('repositions vue-stately list focus when the focused item is removed from collection', async () => {
    let options = reactive({
      items: [
        {key: 'item-1', textValue: 'Vue', type: 'item', value: {label: 'Vue'}},
        {key: 'item-2', textValue: 'React', type: 'item', value: {label: 'React'}},
        {key: 'item-3', textValue: 'Svelte', type: 'item', value: {label: 'Svelte'}}
      ] as StatelyListNode<{label: string}>[],
      selectionMode: 'none' as const
    });

    let listState = useStatelyListState(options);
    listState.selectionManager.setFocusedKey('item-2');
    expect(listState.selectionManager.focusedKey.value).toBe('item-2');

    options.items = [
      {key: 'item-1', textValue: 'Vue', type: 'item', value: {label: 'Vue'}},
      {key: 'item-3', textValue: 'Svelte', type: 'item', value: {label: 'Svelte'}}
    ];
    await nextTick();

    expect(listState.selectionManager.focusedKey.value).toBe('item-3');
  });

  it('manages vue-stately single-select list state and selected item lookups', () => {
    let nodes: StatelyListNode<{label: string}>[] = [
      {key: 'overview', textValue: 'Overview', type: 'item', value: {label: 'Overview'}},
      {key: 'details', textValue: 'Details', type: 'item', value: {label: 'Details'}}
    ];

    let selectedKey = ref<string | null>('overview');
    let selectionChanges: Array<string | null> = [];
    let listState = useStatelySingleSelectListState({
      collection: new StatelyListCollection(nodes),
      selectedKey,
      onSelectionChange: (key) => {
        selectionChanges.push(key as string | null);
        selectedKey.value = key as string | null;
      }
    });

    expect(listState.selectedKey.value).toBe('overview');
    expect(listState.selectedItem.value?.textValue).toBe('Overview');

    listState.setSelectedKey('details');
    expect(selectedKey.value).toBe('details');
    expect(listState.selectionManager.firstSelectedKey).toBe('details');
    expect(selectionChanges).toEqual(['details']);

    listState.setSelectedKey('details');
    expect(selectionChanges).toEqual(['details']);

    listState.selectionManager.toggleSelection('details');
    expect(selectedKey.value).toBe('details');
    expect(listState.selectedItem.value?.key).toBe('details');
    expect(selectionChanges[selectionChanges.length - 1]).toBe('details');
  });

  it('keeps vue-stately single-select list controlled without mutating control refs', () => {
    let nodes: StatelyListNode<{label: string}>[] = [
      {key: 'overview', textValue: 'Overview', type: 'item', value: {label: 'Overview'}},
      {key: 'details', textValue: 'Details', type: 'item', value: {label: 'Details'}}
    ];
    let selectedKey = ref<string | null>('overview');
    let selectionChanges: Array<string | null> = [];
    let listState = useStatelySingleSelectListState({
      collection: new StatelyListCollection(nodes),
      selectedKey,
      onSelectionChange: (key) => {
        selectionChanges.push(key as string | null);
      }
    });

    listState.setSelectedKey('details');

    expect(selectedKey.value).toBe('overview');
    expect(listState.selectedKey.value).toBe('overview');
    expect(selectionChanges).toEqual(['details']);
  });

  it('suppresses duplicate vue-stately single-select controlled callbacks without parent sync in one turn', () => {
    let nodes: StatelyListNode<{label: string}>[] = [
      {key: 'overview', textValue: 'Overview', type: 'item', value: {label: 'Overview'}},
      {key: 'details', textValue: 'Details', type: 'item', value: {label: 'Details'}}
    ];
    let selectedKey = ref<string | null>('overview');
    let selectionChanges: Array<string | null> = [];
    let listState = useStatelySingleSelectListState({
      collection: new StatelyListCollection(nodes),
      selectedKey,
      onSelectionChange: (key) => {
        selectionChanges.push(key as string | null);
      }
    });

    listState.setSelectedKey('details');
    listState.setSelectedKey('details');

    expect(selectedKey.value).toBe('overview');
    expect(listState.selectedKey.value).toBe('overview');
    expect(selectionChanges).toEqual(['details']);
  });

  it('warns when vue-stately single-select list switches between controlled and uncontrolled', async () => {
    let warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    let nodes: StatelyListNode<{label: string}>[] = [
      {key: 'overview', textValue: 'Overview', type: 'item', value: {label: 'Overview'}},
      {key: 'details', textValue: 'Details', type: 'item', value: {label: 'Details'}}
    ];
    let selectedKey = ref<string | null | undefined>('overview');
    useStatelySingleSelectListState({
      collection: new StatelyListCollection(nodes),
      selectedKey
    });

    try {
      selectedKey.value = undefined;
      await nextTick();
      expect(warnSpy).toHaveBeenLastCalledWith('WARN: A component changed from controlled to uncontrolled.');

      selectedKey.value = 'details';
      await nextTick();
      expect(warnSpy).toHaveBeenLastCalledWith('WARN: A component changed from uncontrolled to controlled.');
    } finally {
      warnSpy.mockRestore();
    }
  });

  it('keeps vue-stately single-select list uncontrolled when selectedKey ref is undefined', () => {
    let nodes: StatelyListNode<{label: string}>[] = [
      {key: 'overview', textValue: 'Overview', type: 'item', value: {label: 'Overview'}},
      {key: 'details', textValue: 'Details', type: 'item', value: {label: 'Details'}}
    ];
    let selectedKey = ref<string | null | undefined>(undefined);
    let listState = useStatelySingleSelectListState({
      collection: new StatelyListCollection(nodes),
      defaultSelectedKey: 'overview',
      selectedKey
    });

    listState.setSelectedKey('details');

    expect(selectedKey.value).toBeUndefined();
    expect(listState.selectedKey.value).toBe('details');
    expect(listState.selectedItem.value?.textValue).toBe('Details');
  });

  it('manages vue-stately menu trigger open state and submenu stack', () => {
    let openChanges: boolean[] = [];
    let isOpen = ref(false);
    let state = useStatelyMenuTriggerState({
      isOpen,
      onOpenChange: (nextOpen) => {
        openChanges.push(nextOpen);
        isOpen.value = nextOpen;
      }
    });

    expect(state.isOpen.value).toBe(false);
    state.open('first');
    expect(state.isOpen.value).toBe(true);
    expect(state.focusStrategy.value).toBe('first');

    state.openSubmenu('workspace', 0);
    state.openSubmenu('roadmap', 1);
    expect(state.expandedKeysStack.value).toEqual(['workspace', 'roadmap']);

    state.closeSubmenu('roadmap', 1);
    expect(state.expandedKeysStack.value).toEqual(['workspace']);

    state.toggle('last');
    expect(state.isOpen.value).toBe(false);
    expect(state.expandedKeysStack.value).toEqual([]);
    expect(openChanges).toEqual([true, false]);

    let disabledState = useStatelyMenuTriggerState({
      defaultOpen: true,
      isDisabled: true
    });
    expect(disabledState.isOpen.value).toBe(true);
    disabledState.close();
    expect(disabledState.isOpen.value).toBe(false);
    disabledState.open('first');
    expect(disabledState.isOpen.value).toBe(false);
  });

  it('keeps vue-stately menu trigger controlled without mutating control refs', () => {
    let openChanges: boolean[] = [];
    let isOpen = ref(false);
    let state = useStatelyMenuTriggerState({
      isOpen,
      onOpenChange: (nextOpen) => {
        openChanges.push(nextOpen);
      }
    });

    state.open('first');
    expect(isOpen.value).toBe(false);
    expect(state.isOpen.value).toBe(false);
    expect(openChanges).toEqual([true]);

    state.open('first');
    expect(isOpen.value).toBe(false);
    expect(openChanges).toEqual([true]);
  });

  it('warns when vue-stately menu trigger switches between controlled and uncontrolled', async () => {
    let warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    let isOpen = ref<boolean | undefined>(true);
    useStatelyMenuTriggerState({
      isOpen
    });

    try {
      isOpen.value = undefined;
      await nextTick();
      expect(warnSpy).toHaveBeenLastCalledWith('WARN: A component changed from controlled to uncontrolled.');

      isOpen.value = true;
      await nextTick();
      expect(warnSpy).toHaveBeenLastCalledWith('WARN: A component changed from uncontrolled to controlled.');
    } finally {
      warnSpy.mockRestore();
    }
  });

  it('keeps vue-stately menu trigger uncontrolled when isOpen ref is undefined', () => {
    let isOpen = ref<boolean | undefined>(undefined);
    let state = useStatelyMenuTriggerState({
      defaultOpen: false,
      isOpen
    });

    state.open('first');
    expect(isOpen.value).toBeUndefined();
    expect(state.isOpen.value).toBe(true);
    expect(state.focusStrategy.value).toBe('first');
  });

  it('manages vue-stately submenu trigger level, focus strategy, and close-all behavior', () => {
    let root = useStatelyMenuTriggerState();
    let submenu = useStatelySubmenuTriggerState({
      triggerKey: 'settings'
    }, root);

    expect(submenu.submenuLevel).toBe(0);
    expect(submenu.isOpen.value).toBe(false);

    root.open();
    submenu.open('last');
    expect(submenu.isOpen.value).toBe(true);
    expect(submenu.focusStrategy.value).toBe('last');
    expect(root.expandedKeysStack.value).toEqual(['settings']);

    submenu.toggle();
    expect(submenu.isOpen.value).toBe(false);

    submenu.setOpen(true, 'first');
    expect(submenu.isOpen.value).toBe(true);
    expect(submenu.focusStrategy.value).toBe('first');

    submenu.closeAll();
    expect(root.isOpen.value).toBe(false);
    expect(root.expandedKeysStack.value).toEqual([]);
  });

  it('manages vue-stately number field parsing, stepping, and clamped min/max helpers', () => {
    let value = ref(4);
    let changedValues: number[] = [];
    let numberField = useStatelyNumberFieldState({
      maxValue: 10,
      minValue: 0,
      onChange: (nextValue) => {
        changedValues.push(nextValue);
        value.value = nextValue;
      },
      step: 2,
      value
    });

    expect(numberField.numberValue.value).toBe(4);
    expect(numberField.canIncrement.value).toBe(true);
    expect(numberField.canDecrement.value).toBe(true);

    numberField.increment();
    expect(value.value).toBe(6);
    numberField.decrement();
    expect(value.value).toBe(4);

    numberField.setInputValue('11');
    expect(numberField.numberValue.value).toBe(11);
    numberField.commit();
    expect(value.value).toBe(10);

    numberField.decrementToMin();
    expect(value.value).toBe(0);
    numberField.incrementToMax();
    expect(value.value).toBe(10);
    expect(numberField.canIncrement.value).toBe(false);

    numberField.setInputValue('abc');
    expect(numberField.validate(numberField.inputValue.value)).toBe(false);
    numberField.commit();
    expect(numberField.inputValue.value).toContain('10');
    expect(changedValues).toEqual([6, 4, 10, 0, 10]);
  });

  it('keeps vue-stately number field controlled without mutating control refs and suppresses same-turn duplicates', () => {
    let value = ref<number | undefined>(4);
    let changedValues: number[] = [];
    let numberField = useStatelyNumberFieldState({
      maxValue: 10,
      minValue: 0,
      onChange: (nextValue) => {
        changedValues.push(nextValue);
      },
      step: 2,
      value
    });

    numberField.increment();
    expect(value.value).toBe(4);
    expect(changedValues).toEqual([6]);

    numberField.increment();
    expect(value.value).toBe(4);
    expect(changedValues).toEqual([6]);
  });

  it('updates vue-stately number-field server validation scope when name changes', async () => {
    let fieldName = ref('primary');
    let validationErrors = ref<Record<string, string[]>>({
      primary: ['Primary error'],
      secondary: ['Secondary error']
    });
    let numberField = useStatelyNumberFieldState({
      name: fieldName,
      validationBehavior: ref<'aria' | 'native'>('aria'),
      validationErrors,
      value: ref(10)
    });

    expect(numberField.displayValidation.value.validationErrors).toEqual(['Primary error']);

    fieldName.value = 'secondary';
    await nextTick();

    expect(numberField.displayValidation.value.validationErrors).toEqual(['Secondary error']);
  });

  it('manages vue-stately overlay trigger open, close, and toggle state', () => {
    let changes: boolean[] = [];
    let isOpen = ref(false);
    let overlayState = useStatelyOverlayTriggerState({
      isOpen,
      onOpenChange: (nextOpen) => {
        changes.push(nextOpen);
        isOpen.value = nextOpen;
      }
    });

    expect(overlayState.isOpen.value).toBe(false);
    overlayState.open();
    expect(isOpen.value).toBe(true);
    overlayState.toggle();
    expect(isOpen.value).toBe(false);
    overlayState.setOpen(true);
    expect(isOpen.value).toBe(true);
    overlayState.close();
    expect(isOpen.value).toBe(false);
    expect(changes).toEqual([true, false, true, false]);

    let uncontrolledOverlayState = useStatelyOverlayTriggerState({defaultOpen: true});
    expect(uncontrolledOverlayState.isOpen.value).toBe(true);
    uncontrolledOverlayState.close();
    expect(uncontrolledOverlayState.isOpen.value).toBe(false);
  });

  it('keeps vue-stately overlay trigger controlled without mutating control refs', () => {
    let changes: boolean[] = [];
    let isOpen = ref(false);
    let overlayState = useStatelyOverlayTriggerState({
      isOpen,
      onOpenChange: (nextOpen) => {
        changes.push(nextOpen);
      }
    });

    overlayState.open();
    expect(isOpen.value).toBe(false);
    expect(overlayState.isOpen.value).toBe(false);
    expect(changes).toEqual([true]);

    overlayState.open();
    expect(isOpen.value).toBe(false);
    expect(changes).toEqual([true]);
  });

  it('manages vue-stately radio group selection, focus tracking, and required validation', () => {
    let selectedValue = ref<string | null>('react');
    let changedValues: string[] = [];
    let radioGroup = useStatelyRadioGroupState({
      isRequired: true,
      onChange: (value) => {
        changedValues.push(value);
        selectedValue.value = value;
      },
      value: selectedValue
    });

    expect(radioGroup.selectedValue.value).toBe('react');
    expect(radioGroup.defaultSelectedValue).toBe('react');

    radioGroup.setLastFocusedValue('vue');
    expect(radioGroup.lastFocusedValue.value).toBe('vue');

    radioGroup.setSelectedValue('vue');
    expect(selectedValue.value).toBe('vue');
    expect(changedValues).toEqual(['vue']);
    radioGroup.setSelectedValue('vue');
    expect(changedValues).toEqual(['vue']);
    expect(radioGroup.validationState.value).toBeNull();

    let disabledGroup = useStatelyRadioGroupState({
      defaultValue: 'react',
      isDisabled: true
    });
    disabledGroup.setSelectedValue('vue');
    expect(disabledGroup.selectedValue.value).toBe('react');

    let requiredGroup = useStatelyRadioGroupState({
      defaultValue: null,
      isRequired: true
    });
    requiredGroup.commitValidation();
    expect(requiredGroup.isInvalid.value).toBe(true);
    expect(requiredGroup.validationState.value).toBe('invalid');
  });

  it('updates vue-stately radio-group server validation scope when name changes', async () => {
    let groupName = ref('primary');
    let validationErrors = ref<Record<string, string[]>>({
      primary: ['Primary error'],
      secondary: ['Secondary error']
    });
    let radioGroup = useStatelyRadioGroupState({
      name: groupName,
      validationBehavior: ref<'aria' | 'native'>('aria'),
      validationErrors,
      value: ref('react')
    });

    expect(radioGroup.displayValidation.value.validationErrors).toEqual(['Primary error']);

    groupName.value = 'secondary';
    await nextTick();

    expect(radioGroup.displayValidation.value.validationErrors).toEqual(['Secondary error']);
  });

  it('keeps vue-stately radio group controlled without mutating control refs', () => {
    let selectedValue = ref<string | null>('react');
    let changedValues: Array<string | null> = [];
    let radioGroup = useStatelyRadioGroupState({
      onChange: (value) => {
        changedValues.push(value);
      },
      value: selectedValue
    });

    radioGroup.setSelectedValue('vue');
    radioGroup.setSelectedValue('vue');

    expect(selectedValue.value).toBe('react');
    expect(radioGroup.selectedValue.value).toBe('react');
    expect(changedValues).toEqual(['vue']);
  });

  it('emits vue-stately radio-group onChange for null selection parity', () => {
    let changes: Array<string | null> = [];
    let radioGroup = useStatelyRadioGroupState({
      defaultValue: 'vue',
      onChange: (value) => {
        changes.push(value);
      }
    });

    radioGroup.setSelectedValue('react');
    radioGroup.setSelectedValue(null);

    expect(radioGroup.selectedValue.value).toBeNull();
    expect(changes).toEqual(['react', null]);
  });

  it('warns when vue-stately radio group switches between controlled and uncontrolled', async () => {
    let warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    let selectedValue = ref<string | null | undefined>('react');
    useStatelyRadioGroupState({
      value: selectedValue
    });

    try {
      selectedValue.value = undefined;
      await nextTick();
      expect(warnSpy).toHaveBeenLastCalledWith('WARN: A component changed from controlled to uncontrolled.');

      selectedValue.value = 'vue';
      await nextTick();
      expect(warnSpy).toHaveBeenLastCalledWith('WARN: A component changed from uncontrolled to controlled.');
    } finally {
      warnSpy.mockRestore();
    }
  });

  it('keeps vue-stately radio group uncontrolled when value ref is undefined', () => {
    let selectedValue = ref<string | null | undefined>(undefined);
    let changedValues: string[] = [];
    let radioGroup = useStatelyRadioGroupState({
      defaultValue: 'react',
      onChange: (value) => {
        changedValues.push(value);
      },
      value: selectedValue
    });

    radioGroup.setSelectedValue('vue');

    expect(selectedValue.value).toBeUndefined();
    expect(radioGroup.selectedValue.value).toBe('vue');
    expect(changedValues).toEqual(['vue']);
  });

  it('manages vue-stately search field controlled and uncontrolled value state', () => {
    let uncontrolledChanges: string[] = [];
    let uncontrolledState = useStatelySearchFieldState({
      defaultValue: 'Roadmap',
      onChange: (value) => {
        uncontrolledChanges.push(value);
      }
    });

    expect(uncontrolledState.value.value).toBe('Roadmap');
    uncontrolledState.setValue('Vue');
    expect(uncontrolledState.value.value).toBe('Vue');
    expect(uncontrolledChanges).toEqual(['Vue']);

    let controlledValue = ref('React');
    let controlledChanges: string[] = [];
    let controlledState = useStatelySearchFieldState({
      value: controlledValue,
      onChange: (value) => {
        controlledChanges.push(value);
        controlledValue.value = value;
      }
    });

    expect(controlledState.value.value).toBe('React');
    controlledState.setValue('Spectrum');
    expect(controlledState.value.value).toBe('Spectrum');
    expect(controlledChanges).toEqual(['Spectrum']);

    let refBackedUncontrolled = ref<string | undefined>(undefined);
    let refBackedState = useStatelySearchFieldState({
      defaultValue: 'Fallback',
      value: refBackedUncontrolled
    });
    refBackedState.setValue('Draft');
    expect(refBackedState.value.value).toBe('Draft');
    expect(refBackedUncontrolled.value).toBeUndefined();
  });

  it('matches vue-stately search field controlled and coercion semantics with React', () => {
    let controlledValue = ref<unknown>('React');
    let controlledChanges: string[] = [];
    let controlledState = useStatelySearchFieldState({
      onChange: (value) => {
        controlledChanges.push(value);
      },
      value: controlledValue
    });

    controlledState.setValue('Spectrum');
    controlledState.setValue('Spectrum');
    expect(controlledState.value.value).toBe('React');
    expect(controlledValue.value).toBe('React');
    expect(controlledChanges).toEqual(['Spectrum']);

    let numericDefault = useStatelySearchFieldState({
      defaultValue: 13
    });
    expect(numericDefault.value.value).toBe('13');

    let arrayDefault = useStatelySearchFieldState({
      defaultValue: ['hi', 'this', 'is', 'me']
    });
    expect(arrayDefault.value.value).toBe('hi,this,is,me');

    let numericControlled = ref<unknown>(13);
    let numericControlledState = useStatelySearchFieldState({
      value: numericControlled
    });
    expect(numericControlledState.value.value).toBe('13');

    let arrayControlled = ref<unknown>(['hi', 'this', 'is', 'me']);
    let arrayControlledState = useStatelySearchFieldState({
      value: arrayControlled
    });
    expect(arrayControlledState.value.value).toBe('hi,this,is,me');
  });

  it('warns when vue-stately search field switches between controlled and uncontrolled', async () => {
    let warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    let controlledValue = ref<string | undefined>('React');
    useStatelySearchFieldState({
      value: controlledValue
    });

    try {
      controlledValue.value = undefined;
      await nextTick();
      expect(warnSpy).toHaveBeenLastCalledWith('WARN: A component changed from controlled to uncontrolled.');

      controlledValue.value = 'Vue';
      await nextTick();
      expect(warnSpy).toHaveBeenLastCalledWith('WARN: A component changed from uncontrolled to controlled.');
    } finally {
      warnSpy.mockRestore();
    }
  });

  it('manages vue-stately multiple selection state and selection-manager helpers', () => {
    let nodes: StatelyListNode<{label: string}>[] = [
      {key: 'item-1', textValue: 'First', type: 'item', value: {label: 'First'}},
      {key: 'item-2', textValue: 'Second', type: 'item', value: {label: 'Second'}},
      {key: 'item-3', textValue: 'Third', type: 'item', value: {label: 'Third'}}
    ];

    let selectionChanges: Array<string[] | 'all'> = [];
    let state = useStatelyMultipleSelectionState({
      defaultSelectedKeys: ['item-1'],
      onSelectionChange: (keys) => {
        selectionChanges.push(keys === 'all' ? 'all' : Array.from(keys) as string[]);
      },
      selectionMode: 'multiple'
    });

    expect(state.selectionMode).toBe('multiple');
    expect(state.selectedKeys.value).not.toBe('all');
    if (state.selectedKeys.value === 'all') {
      throw new Error('Expected key set selection state');
    }
    expect(Array.from(state.selectedKeys.value)).toEqual(['item-1']);

    state.setFocused(true);
    state.setFocusedKey('item-2', 'last');
    expect(state.isFocused.value).toBe(true);
    expect(state.focusedKey.value).toBe('item-2');
    expect(state.childFocusStrategy.value).toBe('last');

    let manager = new StatelySelectionManager(new StatelyListCollection(nodes), state);
    expect(manager.firstSelectedKey).toBe('item-1');
    manager.extendSelection('item-3');
    expect(Array.from(manager.selectedKeys)).toEqual(['item-1', 'item-2', 'item-3']);

    manager.toggleSelection('item-2');
    expect(Array.from(manager.selectedKeys)).toEqual(['item-1', 'item-3']);
    expect(manager.isSelectionEqual(new Set(['item-1', 'item-3']))).toBe(true);

    manager.selectAll();
    expect(state.selectedKeys.value).toBe('all');
    expect(manager.isSelectAll).toBe(true);

    manager.toggleSelectAll();
    expect(manager.isEmpty).toBe(true);

    let selection = new StatelySelection(['item-2'], 'item-2', 'item-2');
    let selectionCopy = new StatelySelection(selection);
    expect(Array.from(selectionCopy)).toEqual(['item-2']);
    expect(selectionCopy.anchorKey).toBe('item-2');
    expect(selectionCopy.currentKey).toBe('item-2');
    expect(selectionChanges.length).toBeGreaterThan(0);
  });

  it('syncs vue-stately multiple selection behavior with prop updates', async () => {
    let props = reactive({
      selectionBehavior: 'toggle' as const,
      selectionMode: 'multiple' as const
    });
    let state = useStatelyMultipleSelectionState(props);

    expect(state.selectionBehavior.value).toBe('toggle');

    props.selectionBehavior = 'replace';
    await nextTick();
    expect(state.selectionBehavior.value).toBe('replace');
  });

  it('resets vue-stately multiple selection behavior to replace when replace-mode selection empties', async () => {
    let state = useStatelyMultipleSelectionState({
      defaultSelectedKeys: ['item-1'],
      selectionBehavior: 'replace',
      selectionMode: 'multiple'
    });

    state.setSelectionBehavior('toggle');
    expect(state.selectionBehavior.value).toBe('toggle');

    state.setSelectedKeys(new Set());
    await nextTick();
    expect(state.selectionBehavior.value).toBe('replace');
  });

  it('warns when vue-stately multiple selection switches between controlled and uncontrolled', async () => {
    let warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    let selectedKeys = ref<Set<string> | 'all' | undefined>(new Set(['item-1']));
    useStatelyMultipleSelectionState({
      selectedKeys,
      selectionMode: 'multiple'
    });

    try {
      selectedKeys.value = undefined;
      await nextTick();
      expect(warnSpy).toHaveBeenLastCalledWith('WARN: A component changed from controlled to uncontrolled.');

      selectedKeys.value = new Set(['item-2']);
      await nextTick();
      expect(warnSpy).toHaveBeenLastCalledWith('WARN: A component changed from uncontrolled to controlled.');
    } finally {
      warnSpy.mockRestore();
    }
  });

  it('keeps vue-stately multiple selection uncontrolled when selectedKeys ref is undefined', () => {
    let selectedKeysRef = ref<Set<string> | 'all' | undefined>(undefined);
    let state = useStatelyMultipleSelectionState({
      defaultSelectedKeys: ['item-1'],
      selectedKeys: selectedKeysRef,
      selectionMode: 'multiple'
    });

    state.setSelectedKeys(new Set(['item-2']));

    expect(selectedKeysRef.value).toBeUndefined();
    expect(state.selectedKeys.value).not.toBe('all');
    if (state.selectedKeys.value === 'all') {
      throw new Error('Expected key set selection state');
    }
    expect(Array.from(state.selectedKeys.value)).toEqual(['item-2']);
  });

  it('keeps vue-stately multiple selection controlled without mutating control refs', () => {
    let selectedKeysRef = ref<Set<string> | 'all' | undefined>(new Set(['item-1']));
    let selectionChanges: Array<string[] | 'all'> = [];
    let state = useStatelyMultipleSelectionState({
      onSelectionChange: (keys) => {
        selectionChanges.push(keys === 'all' ? 'all' : Array.from(keys) as string[]);
      },
      selectedKeys: selectedKeysRef,
      selectionMode: 'multiple'
    });

    state.setSelectedKeys(new Set(['item-2']));
    expect(selectedKeysRef.value).not.toBe('all');
    if (selectedKeysRef.value === 'all' || selectedKeysRef.value == null) {
      throw new Error('Expected key set selection state');
    }
    expect(Array.from(selectedKeysRef.value)).toEqual(['item-1']);
    expect(state.selectedKeys.value).not.toBe('all');
    if (state.selectedKeys.value === 'all') {
      throw new Error('Expected key set selection state');
    }
    expect(Array.from(state.selectedKeys.value)).toEqual(['item-1']);
    expect(selectionChanges).toEqual([['item-2']]);

    state.setSelectedKeys(new Set(['item-2']));
    expect(selectionChanges).toEqual([['item-2'], ['item-2']]);
  });

  it('suppresses duplicate vue-stately multiple selection controlled callbacks for the same update in one turn', () => {
    let selectedKeysRef = ref<Set<string> | 'all' | undefined>(new Set(['item-1']));
    let selectionChanges: Array<string[] | 'all'> = [];
    let state = useStatelyMultipleSelectionState({
      onSelectionChange: (keys) => {
        selectionChanges.push(keys === 'all' ? 'all' : Array.from(keys) as string[]);
      },
      selectedKeys: selectedKeysRef,
      selectionMode: 'multiple'
    });

    let requestedSelection = new Set(['item-2']);
    state.setSelectedKeys(requestedSelection);
    state.setSelectedKeys(requestedSelection);

    expect(selectedKeysRef.value).not.toBe('all');
    if (selectedKeysRef.value === 'all' || selectedKeysRef.value == null) {
      throw new Error('Expected key set selection state');
    }
    expect(Array.from(selectedKeysRef.value)).toEqual(['item-1']);
    expect(selectionChanges).toEqual([['item-2']]);
  });

  it('manages vue-stately select selection, trigger state, and value normalization', () => {
    let nodes: StatelyListNode<{label: string}>[] = [
      {key: 'vue', textValue: 'Vue', type: 'item', value: {label: 'Vue'}},
      {key: 'react', textValue: 'React', type: 'item', value: {label: 'React'}},
      {key: 'svelte', textValue: 'Svelte', type: 'item', value: {label: 'Svelte'}}
    ];

    let selectedValue = ref<string | null | undefined>('react');
    let changedValues: Array<string | null> = [];
    let selectionChanges: Array<string | null> = [];
    let singleState = useStatelySelectState({
      collection: new StatelyListCollection(nodes),
      onChange: (nextValue) => {
        selectedValue.value = nextValue as string | null;
        changedValues.push(nextValue as string | null);
      },
      onSelectionChange: (key) => {
        selectionChanges.push(key as string | null);
      },
      value: selectedValue
    });

    expect(singleState.value.value).toBe('react');
    expect(singleState.selectedItem.value?.textValue).toBe('React');

    singleState.open('first');
    expect(singleState.isOpen.value).toBe(true);
    expect(singleState.focusStrategy.value).toBe('first');

    singleState.selectionManager.replaceSelection('vue');
    expect(singleState.value.value).toBe('vue');
    expect(singleState.isOpen.value).toBe(false);
    expect(selectionChanges).toEqual(['vue']);

    singleState.setSelectedKey('svelte');
    expect(selectedValue.value).toBe('svelte');
    expect(selectionChanges).toEqual(['vue', 'svelte']);
    expect(changedValues).toEqual(['vue', 'svelte']);
    singleState.setSelectedKey('svelte');
    expect(selectionChanges).toEqual(['vue', 'svelte']);
    expect(changedValues).toEqual(['vue', 'svelte']);

    let multiValue = ref<readonly string[] | undefined>([]);
    let multiChangeValues: string[][] = [];
    let multiState = useStatelySelectState({
      collection: new StatelyListCollection(nodes),
      onChange: (nextValue) => {
        let resolved = [...(nextValue as readonly string[])];
        multiValue.value = resolved;
        multiChangeValues.push(resolved);
      },
      selectionMode: 'multiple',
      value: multiValue
    });

    expect(multiState.value.value).toEqual([]);
    multiState.setValue(['react', 'svelte']);
    expect(multiState.value.value).toEqual(['react', 'svelte']);
    expect(Array.from(multiState.selectionManager.selectedKeys.value)).toEqual(['react', 'svelte']);
    let sameValueRef = multiState.value.value;
    multiState.setValue(sameValueRef);
    expect(multiChangeValues).toEqual([['react', 'svelte']]);
  });

  it('repositions vue-stately select value when the selected option is removed from collection', async () => {
    let options = reactive({
      collection: new StatelyListCollection([
        {key: 'vue', textValue: 'Vue', type: 'item', value: {label: 'Vue'}},
        {key: 'react', textValue: 'React', type: 'item', value: {label: 'React'}},
        {key: 'svelte', textValue: 'Svelte', type: 'item', value: {label: 'Svelte'}}
      ] as StatelyListNode<{label: string}>[]),
      defaultSelectedKey: 'react'
    });
    let state = useStatelySelectState(options);
    expect(state.value.value).toBe('react');

    options.collection = new StatelyListCollection([
      {key: 'vue', textValue: 'Vue', type: 'item', value: {label: 'Vue'}},
      {key: 'svelte', textValue: 'Svelte', type: 'item', value: {label: 'Svelte'}}
    ] as StatelyListNode<{label: string}>[]);
    await nextTick();

    expect(state.value.value).toBe('vue');
    expect(state.selectedKey.value).toBe('vue');
  });

  it('keeps vue-stately select controlled without mutating control refs', () => {
    let nodes: StatelyListNode<{label: string}>[] = [
      {key: 'vue', textValue: 'Vue', type: 'item', value: {label: 'Vue'}},
      {key: 'react', textValue: 'React', type: 'item', value: {label: 'React'}},
      {key: 'svelte', textValue: 'Svelte', type: 'item', value: {label: 'Svelte'}}
    ];

    let selectedValue = ref<string | null | undefined>('react');
    let changedValues: Array<string | null> = [];
    let selectionChanges: Array<string | null> = [];
    let singleState = useStatelySelectState({
      collection: new StatelyListCollection(nodes),
      onChange: (nextValue) => {
        changedValues.push(nextValue as string | null);
      },
      onSelectionChange: (key) => {
        selectionChanges.push(key as string | null);
      },
      value: selectedValue
    });

    singleState.setSelectedKey('svelte');
    expect(selectedValue.value).toBe('react');
    expect(singleState.value.value).toBe('react');
    expect(changedValues).toEqual(['svelte']);
    expect(selectionChanges).toEqual(['svelte']);

    singleState.setSelectedKey('svelte');
    expect(changedValues).toEqual(['svelte']);
    expect(selectionChanges).toEqual(['svelte', 'svelte']);

    let multiValue = ref<readonly string[] | undefined>(['react']);
    let multiChangeValues: string[][] = [];
    let multiState = useStatelySelectState({
      collection: new StatelyListCollection(nodes),
      onChange: (nextValue) => {
        multiChangeValues.push([...(nextValue as readonly string[])]);
      },
      selectionMode: 'multiple',
      value: multiValue
    });

    multiState.setValue(['react', 'svelte']);
    expect(multiValue.value).toEqual(['react']);
    expect(multiState.value.value).toEqual(['react']);
    expect(multiChangeValues).toEqual([['react', 'svelte']]);
  });

  it('warns when vue-stately select switches between controlled and uncontrolled', async () => {
    let nodes: StatelyListNode<{label: string}>[] = [
      {key: 'vue', textValue: 'Vue', type: 'item', value: {label: 'Vue'}},
      {key: 'react', textValue: 'React', type: 'item', value: {label: 'React'}},
      {key: 'svelte', textValue: 'Svelte', type: 'item', value: {label: 'Svelte'}}
    ];
    let warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    try {
      let controlledValue = ref<string | null | undefined>('react');
      useStatelySelectState({
        collection: new StatelyListCollection(nodes),
        value: controlledValue
      });

      controlledValue.value = undefined;
      await nextTick();
      expect(warnSpy).toHaveBeenLastCalledWith('WARN: A component changed from controlled to uncontrolled.');

      controlledValue.value = 'vue';
      await nextTick();
      expect(warnSpy).toHaveBeenLastCalledWith('WARN: A component changed from uncontrolled to controlled.');

      let controlledSelectedKey = ref<string | null | undefined>('react');
      useStatelySelectState({
        collection: new StatelyListCollection(nodes),
        selectedKey: controlledSelectedKey
      });

      controlledSelectedKey.value = undefined;
      await nextTick();
      expect(warnSpy).toHaveBeenLastCalledWith('WARN: A component changed from controlled to uncontrolled.');

      controlledSelectedKey.value = 'svelte';
      await nextTick();
      expect(warnSpy).toHaveBeenLastCalledWith('WARN: A component changed from uncontrolled to controlled.');
    } finally {
      warnSpy.mockRestore();
    }
  });

  it('keeps vue-stately select uncontrolled when control refs are undefined', () => {
    let nodes: StatelyListNode<{label: string}>[] = [
      {key: 'vue', textValue: 'Vue', type: 'item', value: {label: 'Vue'}},
      {key: 'react', textValue: 'React', type: 'item', value: {label: 'React'}},
      {key: 'svelte', textValue: 'Svelte', type: 'item', value: {label: 'Svelte'}}
    ];

    let valueRef = ref<readonly string[] | undefined>(undefined);
    let multiState = useStatelySelectState({
      collection: new StatelyListCollection(nodes),
      defaultValue: ['react'],
      selectionMode: 'multiple',
      value: valueRef
    });

    multiState.setValue(['react', 'svelte']);
    expect(valueRef.value).toBeUndefined();
    expect(multiState.value.value).toEqual(['react', 'svelte']);

    let selectedKeyRef = ref<string | null | undefined>(undefined);
    let singleState = useStatelySelectState({
      collection: new StatelyListCollection(nodes),
      defaultSelectedKey: 'react',
      selectedKey: selectedKeyRef
    });

    singleState.setSelectedKey('svelte');
    expect(selectedKeyRef.value).toBeUndefined();
    expect(singleState.selectedKey.value).toBe('svelte');
    expect(singleState.value.value).toBe('svelte');
  });

  it('manages vue-stately slider thumb values, constraints, and drag lifecycle', () => {
    let sliderValue = ref<number[] | undefined>([20, 60]);
    let changeValues: number[][] = [];
    let changeEndValues: number[][] = [];
    let slider = useStatelySliderState({
      maxValue: 100,
      minValue: 0,
      numberFormatter: new Intl.NumberFormat('en-US'),
      onChange: (nextValue) => {
        let nextValues = Array.isArray(nextValue) ? nextValue : [nextValue];
        sliderValue.value = [...nextValues];
        changeValues.push([...nextValues]);
      },
      onChangeEnd: (nextValue) => {
        let nextValues = Array.isArray(nextValue) ? nextValue : [nextValue];
        changeEndValues.push([...nextValues]);
      },
      step: 5,
      value: sliderValue
    });

    expect(slider.values.value).toEqual([20, 60]);
    expect(slider.getThumbMinValue(1)).toBe(20);
    expect(slider.getThumbMaxValue(0)).toBe(60);
    expect(slider.getThumbValueLabel(0)).toBe('20');

    slider.setThumbValue(0, 80);
    expect(slider.values.value).toEqual([60, 60]);
    slider.setThumbPercent(1, 1);
    expect(slider.getThumbValue(1)).toBe(100);
    expect(slider.getThumbPercent(1)).toBe(1);

    slider.setThumbDragging(0, true);
    expect(slider.isThumbDragging(0)).toBe(true);
    slider.incrementThumb(0, 10);
    slider.setThumbDragging(0, false);

    expect(slider.values.value).toEqual([70, 100]);
    expect(changeValues[changeValues.length - 1]).toEqual([70, 100]);
    expect(changeEndValues[changeEndValues.length - 1]).toEqual([70, 100]);
    expect(slider.decrementThumb).toBeTypeOf('function');
  });

  it('keeps vue-stately slider drag callbacks aligned in controlled mode without parent sync', () => {
    let controlledValue = ref<number[] | undefined>([0]);
    let onChangeValues: number[][] = [];
    let onChangeEndValues: number[][] = [];
    let slider = useStatelySliderState({
      maxValue: 100,
      minValue: 0,
      onChange: (nextValue) => {
        controlledValue.value = [0];
        onChangeValues.push(Array.isArray(nextValue) ? [...nextValue] : [nextValue]);
      },
      onChangeEnd: (nextValue) => {
        onChangeEndValues.push(Array.isArray(nextValue) ? [...nextValue] : [nextValue]);
      },
      step: 5,
      value: controlledValue
    });

    slider.setThumbDragging(0, true);
    slider.setThumbValue(0, 20);
    slider.setThumbValue(0, 40);
    slider.setThumbDragging(0, false);

    expect(controlledValue.value).toEqual([0]);
    expect(onChangeValues).toEqual([[20], [40]]);
    expect(onChangeEndValues).toEqual([[40]]);
  });

  it('keeps vue-stately slider controlled without mutating control refs and suppresses same-turn duplicates', () => {
    let controlledValue = ref<number[] | undefined>([20, 60]);
    let onChangeValues: number[][] = [];
    let slider = useStatelySliderState({
      maxValue: 100,
      minValue: 0,
      onChange: (nextValue) => {
        onChangeValues.push(Array.isArray(nextValue) ? [...nextValue] : [nextValue]);
      },
      step: 5,
      value: controlledValue
    });

    slider.setThumbValue(0, 80);
    expect(controlledValue.value).toEqual([20, 60]);
    expect(slider.values.value).toEqual([20, 60]);
    expect(onChangeValues).toEqual([[60, 60]]);

    slider.setThumbValue(0, 80);
    expect(controlledValue.value).toEqual([20, 60]);
    expect(slider.values.value).toEqual([20, 60]);
    expect(onChangeValues).toEqual([[60, 60]]);
  });

  it('manages vue-stately step list completion and selection eligibility', () => {
    let nodes: StatelyListNode<{label: string}>[] = [
      {key: 'setup', textValue: 'Setup', type: 'item', value: {label: 'Setup'}},
      {key: 'details', textValue: 'Details', type: 'item', value: {label: 'Details'}},
      {key: 'review', textValue: 'Review', type: 'item', value: {label: 'Review'}}
    ];

    let completedChanges: Array<string | null> = [];
    let stepList = useStatelyStepListState({
      collection: new StatelyListCollection(nodes),
      defaultLastCompletedStep: 'setup',
      defaultSelectedKey: 'details',
      onLastCompletedStepChange: (key) => {
        completedChanges.push(key as string | null);
      }
    });

    expect(stepList.lastCompletedStep.value).toBe('setup');
    expect(stepList.isCompleted('setup')).toBe(true);
    expect(stepList.isSelectable('details')).toBe(true);
    expect(stepList.isSelectable('review')).toBe(false);

    stepList.setSelectedKey('review');
    expect(stepList.selectedKey.value).toBe('review');
    expect(stepList.lastCompletedStep.value).toBe('details');
    expect(stepList.isCompleted('details')).toBe(true);
    expect(stepList.isSelectable('review')).toBe(true);

    let readOnlyStepList = useStatelyStepListState({
      collection: new StatelyListCollection(nodes),
      defaultSelectedKey: 'setup',
      isReadOnly: true
    });
    expect(readOnlyStepList.isSelectable('setup')).toBe(false);
    expect(completedChanges).toContain('details');
  });

  it('repositions vue-stately step list selection when the selected step is removed from collection', async () => {
    let options = reactive({
      items: [
        {key: 'setup', textValue: 'Setup', type: 'item', value: {label: 'Setup'}},
        {key: 'details', textValue: 'Details', type: 'item', value: {label: 'Details'}},
        {key: 'review', textValue: 'Review', type: 'item', value: {label: 'Review'}}
      ] as StatelyListNode<{label: string}>[],
      selectionMode: 'single' as const
    });
    let stepList = useStatelyStepListState(options);

    stepList.setSelectedKey('details');
    expect(stepList.selectedKey.value).toBe('details');

    options.items = [
      {key: 'setup', textValue: 'Setup', type: 'item', value: {label: 'Setup'}},
      {key: 'review', textValue: 'Review', type: 'item', value: {label: 'Review'}}
    ];
    await nextTick();

    expect(stepList.selectedKey.value).toBe('setup');
  });

  it('keeps vue-stately step list controlled without mutating control refs', () => {
    let nodes: StatelyListNode<{label: string}>[] = [
      {key: 'setup', textValue: 'Setup', type: 'item', value: {label: 'Setup'}},
      {key: 'details', textValue: 'Details', type: 'item', value: {label: 'Details'}},
      {key: 'review', textValue: 'Review', type: 'item', value: {label: 'Review'}}
    ];

    let lastCompletedStep = ref<string | null | undefined>('setup');
    let completedChanges: Array<string | null> = [];
    let stepList = useStatelyStepListState({
      collection: new StatelyListCollection(nodes),
      defaultSelectedKey: 'details',
      lastCompletedStep,
      onLastCompletedStepChange: (key) => {
        completedChanges.push(key as string | null);
      }
    });

    stepList.setLastCompletedStep('details');
    expect(lastCompletedStep.value).toBe('setup');
    expect(stepList.lastCompletedStep.value).toBe('setup');
    expect(completedChanges).toEqual(['details']);

    stepList.setLastCompletedStep('details');
    expect(lastCompletedStep.value).toBe('setup');
    expect(completedChanges).toEqual(['details']);
  });

  it('warns when vue-stately slider and steplist switch between controlled and uncontrolled', async () => {
    let warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    try {
      let sliderValue = ref<number[] | undefined>([20, 60]);
      useStatelySliderState({
        value: sliderValue
      });

      sliderValue.value = undefined;
      await nextTick();
      expect(warnSpy).toHaveBeenLastCalledWith('WARN: A component changed from controlled to uncontrolled.');

      sliderValue.value = [30, 70];
      await nextTick();
      expect(warnSpy).toHaveBeenLastCalledWith('WARN: A component changed from uncontrolled to controlled.');

      let nodes: StatelyListNode<{label: string}>[] = [
        {key: 'setup', textValue: 'Setup', type: 'item', value: {label: 'Setup'}},
        {key: 'details', textValue: 'Details', type: 'item', value: {label: 'Details'}},
        {key: 'review', textValue: 'Review', type: 'item', value: {label: 'Review'}}
      ];

      let lastCompletedStep = ref<string | null | undefined>('setup');
      useStatelyStepListState({
        collection: new StatelyListCollection(nodes),
        defaultSelectedKey: 'details',
        lastCompletedStep
      });

      lastCompletedStep.value = undefined;
      await nextTick();
      expect(warnSpy).toHaveBeenLastCalledWith('WARN: A component changed from controlled to uncontrolled.');

      lastCompletedStep.value = 'details';
      await nextTick();
      expect(warnSpy).toHaveBeenLastCalledWith('WARN: A component changed from uncontrolled to controlled.');
    } finally {
      warnSpy.mockRestore();
    }
  });

  it('manages vue-stately table collection filtering, row selection, and controlled sort descriptor state', () => {
    let sortDescriptor = ref<{column: string | number, direction: 'ascending' | 'descending'} | null>(null);
    let tableState = useStatelyTableState({
      collection: new StatelyTableCollection({
        columns: [
          {key: 'title', title: 'Title'},
          {key: 'status', title: 'Status'}
        ],
        rows: [
          {
            key: 'row-1',
            textValue: 'Backlog item',
            cells: [
              {textValue: 'Backlog item', value: 'Backlog item'},
              {textValue: 'Open', value: 'Open'}
            ]
          },
          {
            key: 'row-2',
            textValue: 'Done item',
            cells: [
              {textValue: 'Done item', value: 'Done item'},
              {textValue: 'Closed', value: 'Closed'}
            ]
          }
        ]
      }),
      onSortChange: (nextSortDescriptor) => {
        sortDescriptor.value = nextSortDescriptor;
      },
      selectionMode: 'multiple',
      sortDescriptor: sortDescriptor as Ref<{column: string | number, direction: 'ascending' | 'descending'} | null>,
      showSelectionCheckboxes: true
    });

    expect(tableState.collection.size).toBe(2);
    expect(tableState.showSelectionCheckboxes).toBe(true);

    tableState.selectionManager.toggleSelection('row-1');
    expect(Array.from(tableState.selectionManager.selectedKeys.value)).toEqual(['row-1']);

    tableState.sort('status');
    expect(tableState.sortDescriptor.value).toEqual({column: 'status', direction: 'ascending'});
    tableState.sort('status');
    expect(tableState.sortDescriptor.value).toEqual({column: 'status', direction: 'descending'});

    let filteredState = useStatelyFilteredTableState(tableState, (textValue) => {
      return textValue.toLowerCase().includes('done');
    });
    expect(filteredState.collection.size).toBe(1);
    expect(filteredState.collection.getFirstKey()).toBe('row-2');
  });

  it('keeps vue-stately table sort descriptor controlled without mutating control refs', () => {
    let sortDescriptor = ref<{column: string | number, direction: 'ascending' | 'descending'} | null>({
      column: 'status',
      direction: 'ascending'
    });
    let sortChanges: Array<{column: string | number, direction: 'ascending' | 'descending'}> = [];
    let tableState = useStatelyTableState({
      collection: new StatelyTableCollection({
        columns: [
          {key: 'title', title: 'Title'},
          {key: 'status', title: 'Status'}
        ],
        rows: [
          {
            key: 'row-1',
            textValue: 'Backlog item',
            cells: [
              {textValue: 'Backlog item', value: 'Backlog item'},
              {textValue: 'Open', value: 'Open'}
            ]
          }
        ]
      }),
      onSortChange: (nextSortDescriptor) => {
        sortChanges.push(nextSortDescriptor);
      },
      sortDescriptor: sortDescriptor as Ref<{column: string | number, direction: 'ascending' | 'descending'} | null>
    });

    tableState.sort('status');

    expect(sortDescriptor.value).toEqual({column: 'status', direction: 'ascending'});
    expect(sortChanges).toEqual([{column: 'status', direction: 'descending'}]);
  });

  it('keeps vue-stately table showSelectionCheckboxes aligned with props when selectionMode is none', () => {
    let tableState = useStatelyTableState({
      collection: new StatelyTableCollection({
        columns: [
          {key: 'title', title: 'Title'}
        ],
        rows: [
          {
            key: 'row-1',
            textValue: 'Backlog item',
            cells: [
              {textValue: 'Backlog item', value: 'Backlog item'}
            ]
          }
        ]
      }),
      selectionMode: 'none',
      showSelectionCheckboxes: true
    });

    expect(tableState.showSelectionCheckboxes).toBe(true);
  });

  it('syncs vue-stately table selectionMode when props change', async () => {
    let options = reactive({
      collection: new StatelyTableCollection({
        columns: [
          {key: 'title', title: 'Title'}
        ],
        rows: [
          {
            key: 'row-1',
            textValue: 'Backlog item',
            cells: [
              {textValue: 'Backlog item', value: 'Backlog item'}
            ]
          }
        ]
      }),
      selectionMode: 'none' as 'none' | 'single' | 'multiple'
    });
    let tableState = useStatelyTableState(options);
    expect(tableState.selectionMode).toBe('none');

    options.selectionMode = 'multiple';
    await nextTick();

    expect(tableState.selectionMode).toBe('multiple');
  });

  it('manages vue-stately tree grid expanded key state', () => {
    let expandedKeys = ref<Set<string> | undefined>(new Set(['row-1']));
    let expandedChanges: string[][] = [];
    let treeGridState = useStatelyTreeGridState({
      collection: new StatelyTableCollection({
        columns: [
          {key: 'title', title: 'Title'}
        ],
        rows: [
          {key: 'row-1', textValue: 'Row 1', cells: [{textValue: 'Row 1', value: 'Row 1'}]},
          {key: 'row-2', textValue: 'Row 2', cells: [{textValue: 'Row 2', value: 'Row 2'}]}
        ]
      }),
      selectionMode: 'none',
      UNSTABLE_expandedKeys: expandedKeys,
      UNSTABLE_onExpandedChange: (keys) => {
        expandedChanges.push(Array.from(keys) as string[]);
        expandedKeys.value = new Set(keys as Set<string>);
      }
    });

    expect(Array.from(treeGridState.expandedKeys as Set<string>)).toEqual(['row-1']);
    treeGridState.toggleKey('row-2');
    expect(Array.from(expandedKeys.value ?? [])).toEqual(['row-1', 'row-2']);
    treeGridState.toggleKey('row-1');
    expect(Array.from(expandedKeys.value ?? [])).toEqual(['row-2']);
    let sameExpandedSetRef = expandedKeys.value;
    treeGridState.setExpandedKeys(sameExpandedSetRef ?? new Set());
    treeGridState.setExpandedKeys(new Set(['row-2']));
    expect(expandedChanges).toEqual([['row-1', 'row-2'], ['row-2'], ['row-2']]);
  });

  it('keeps vue-stately tree grid controlled without mutating control refs', () => {
    let expandedKeys = ref<Set<string> | undefined>(new Set(['row-1']));
    let expandedChanges: string[][] = [];
    let treeGridState = useStatelyTreeGridState({
      collection: new StatelyTableCollection({
        columns: [
          {key: 'title', title: 'Title'}
        ],
        rows: [
          {key: 'row-1', textValue: 'Row 1', cells: [{textValue: 'Row 1', value: 'Row 1'}]},
          {key: 'row-2', textValue: 'Row 2', cells: [{textValue: 'Row 2', value: 'Row 2'}]}
        ]
      }),
      selectionMode: 'none',
      UNSTABLE_expandedKeys: expandedKeys,
      UNSTABLE_onExpandedChange: (keys) => {
        expandedChanges.push(Array.from(keys) as string[]);
      }
    });

    treeGridState.toggleKey('row-2');
    expect(Array.from(expandedKeys.value ?? [])).toEqual(['row-1']);
    expect(Array.from(treeGridState.expandedKeys as Set<string>)).toEqual(['row-1']);
    expect(expandedChanges).toEqual([['row-1', 'row-2']]);

    treeGridState.toggleKey('row-2');
    expect(Array.from(expandedKeys.value ?? [])).toEqual(['row-1']);
    expect(Array.from(treeGridState.expandedKeys as Set<string>)).toEqual(['row-1']);
    expect(expandedChanges).toEqual([['row-1', 'row-2'], ['row-1', 'row-2']]);
  });

  it('warns when vue-stately tree grid expanded keys switch between controlled and uncontrolled', async () => {
    let warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    let expandedKeys = ref<Set<string> | undefined>(new Set(['row-1']));
    useStatelyTreeGridState({
      collection: new StatelyTableCollection({
        columns: [{key: 'title', title: 'Title'}],
        rows: [{key: 'row-1', textValue: 'Row 1', cells: [{textValue: 'Row 1', value: 'Row 1'}]}]
      }),
      selectionMode: 'none',
      UNSTABLE_expandedKeys: expandedKeys
    });

    try {
      expandedKeys.value = undefined;
      await nextTick();
      expect(warnSpy).toHaveBeenLastCalledWith('WARN: A component changed from controlled to uncontrolled.');

      expandedKeys.value = new Set(['row-1']);
      await nextTick();
      expect(warnSpy).toHaveBeenLastCalledWith('WARN: A component changed from uncontrolled to controlled.');
    } finally {
      warnSpy.mockRestore();
    }
  });

  it('keeps vue-stately tree grid expansion uncontrolled when expanded key ref is undefined', () => {
    let expandedKeys = ref<Set<string> | undefined>(undefined);
    let treeGridState = useStatelyTreeGridState({
      collection: new StatelyTableCollection({
        columns: [{key: 'title', title: 'Title'}],
        rows: [
          {key: 'row-1', textValue: 'Row 1', cells: [{textValue: 'Row 1', value: 'Row 1'}]},
          {key: 'row-2', textValue: 'Row 2', cells: [{textValue: 'Row 2', value: 'Row 2'}]}
        ]
      }),
      selectionMode: 'none',
      defaultExpandedKeys: ['row-1'],
      UNSTABLE_expandedKeys: expandedKeys
    });

    treeGridState.toggleKey('row-2');
    expect(expandedKeys.value).toBeUndefined();
    expect(Array.from(treeGridState.expandedKeys as Set<string>)).toEqual(['row-1', 'row-2']);
  });

  it('builds vue-stately table header rows from column definitions', () => {
    let headerRows = buildStatelyTableHeaderRows([
      {key: 'title', title: 'Title'},
      {key: 'status', title: 'Status'}
    ]);

    expect(headerRows).toHaveLength(1);
    expect(headerRows[0].key).toBe('header-row-0');
    expect(headerRows[0].cells.map((cell) => cell.key)).toEqual(['title', 'status']);
    expect(headerRows[0].cells.map((cell) => cell.textValue)).toEqual(['Title', 'Status']);
  });

  it('manages vue-stately tab list selection and focused-tab synchronization', async () => {
    let nodes: StatelyListNode<{label: string}>[] = [
      {key: 'vue', textValue: 'Vue', type: 'item', value: {label: 'Vue'}},
      {key: 'react', textValue: 'React', type: 'item', value: {label: 'React'}},
      {key: 'svelte', textValue: 'Svelte', type: 'item', value: {label: 'Svelte'}}
    ];

    let selectionChanges: string[] = [];
    let tabListState = useStatelyTabListState({
      collection: new StatelyListCollection(nodes),
      defaultSelectedKey: 'react',
      disabledKeys: ['svelte'],
      onSelectionChange: (key) => {
        selectionChanges.push(String(key));
      }
    });

    expect(tabListState.selectedKey.value).toBe('react');
    expect(tabListState.isDisabled).toBe(false);

    tabListState.setSelectedKey('vue');
    expect(tabListState.selectedKey.value).toBe('vue');

    tabListState.selectionManager.setFocused(false);
    tabListState.selectionManager.setFocusedKey(null);
    tabListState.setSelectedKey('react');
    await nextTick();
    expect(tabListState.selectionManager.focusedKey.value).toBe('react');
    expect(selectionChanges).toEqual(['vue', 'react']);

    let fallbackTabListState = useStatelyTabListState({
      collection: new StatelyListCollection(nodes),
      disabledKeys: ['vue', 'react'],
      onSelectionChange: () => {
        throw new Error('fallback tab initialization should not emit onSelectionChange');
      }
    });
    expect(fallbackTabListState.selectedKey.value).toBe('svelte');
  });

  it('repositions vue-stately tab selection when the selected tab is removed from collection', async () => {
    let options = reactive({
      collection: new StatelyListCollection([
        {key: 'vue', textValue: 'Vue', type: 'item', value: {label: 'Vue'}},
        {key: 'react', textValue: 'React', type: 'item', value: {label: 'React'}},
        {key: 'svelte', textValue: 'Svelte', type: 'item', value: {label: 'Svelte'}}
      ] as StatelyListNode<{label: string}>[]),
      defaultSelectedKey: 'react'
    });
    let tabListState = useStatelyTabListState(options);
    expect(tabListState.selectedKey.value).toBe('react');

    options.collection = new StatelyListCollection([
      {key: 'vue', textValue: 'Vue', type: 'item', value: {label: 'Vue'}},
      {key: 'svelte', textValue: 'Svelte', type: 'item', value: {label: 'Svelte'}}
    ] as StatelyListNode<{label: string}>[]);
    await nextTick();

    expect(tabListState.selectedKey.value).toBe('vue');
    expect(tabListState.selectionManager.focusedKey.value).toBe('vue');
  });

  it('manages vue-stately toast queue visibility, close lifecycle, and queue subscriptions', () => {
    let closedToasts: string[] = [];
    let toastState = useStatelyToastState<string>({
      maxVisibleToasts: 2
    });

    let firstKey = toastState.add('First toast', {
      onClose: () => {
        closedToasts.push('first');
      },
      timeout: 10_000
    });
    let secondKey = toastState.add('Second toast', {
      onClose: () => {
        closedToasts.push('second');
      }
    });
    let thirdKey = toastState.add('Third toast');

    expect(toastState.visibleToasts.value.map((toast) => toast.key)).toEqual([thirdKey, secondKey]);
    toastState.pauseAll();
    toastState.resumeAll();

    toastState.close(secondKey);
    expect(closedToasts).toEqual(['second']);
    expect(toastState.visibleToasts.value.map((toast) => toast.key)).toEqual([thirdKey, firstKey]);

    let queue = new StatelyToastQueue<string>({maxVisibleToasts: 1});
    let queueState = useStatelyToastQueue(queue);
    let queuedToastKey = queueState.add('Queued toast');
    expect(queueState.visibleToasts.value).toHaveLength(1);
    expect(queueState.visibleToasts.value[0]?.key).toBe(queuedToastKey);

    toastState.close(firstKey);
    toastState.close(thirdKey);
    queue.close(queuedToastKey);
  });

  it('starts vue-stately toast timers only after resumeAll is called', () => {
    vi.useFakeTimers();

    try {
      let toastState = useStatelyToastState<string>();

      toastState.add('Timed toast', {timeout: 100});
      expect(toastState.visibleToasts.value).toHaveLength(1);

      vi.advanceTimersByTime(100);
      expect(toastState.visibleToasts.value).toHaveLength(1);

      toastState.resumeAll();
      vi.advanceTimersByTime(99);
      expect(toastState.visibleToasts.value).toHaveLength(1);

      vi.advanceTimersByTime(1);
      expect(toastState.visibleToasts.value).toHaveLength(0);
    } finally {
      vi.runAllTimers();
      vi.useRealTimers();
    }
  });

  it('clears vue-stately toast queues without firing onClose callbacks', () => {
    let onClose = vi.fn();
    let queue = new StatelyToastQueue<string>({maxVisibleToasts: 2});
    queue.add('First toast', {onClose});
    queue.add('Second toast', {onClose});

    queue.clear();

    expect(onClose).not.toHaveBeenCalled();
    expect(queue.visibleToasts).toEqual([]);
  });

  it('manages vue-stately toggle and toggle-group selection behavior', () => {
    let controlledSelected = ref<boolean | undefined>(true);
    let toggleChanges: boolean[] = [];
    let toggleState = useStatelyToggleState({
      isSelected: controlledSelected,
      onChange: (isSelected) => {
        toggleChanges.push(isSelected);
        controlledSelected.value = isSelected;
      }
    });

    expect(toggleState.isSelected.value).toBe(true);
    toggleState.toggle();
    expect(toggleState.isSelected.value).toBe(false);
    expect(toggleChanges).toEqual([false]);

    let readOnlyToggle = useStatelyToggleState({
      defaultSelected: true,
      isReadOnly: true
    });
    readOnlyToggle.toggle();
    expect(readOnlyToggle.isSelected.value).toBe(true);

    let selectedKeys = ref<Set<string | number> | undefined>(new Set(['bold']));
    let groupSelectionChanges: string[][] = [];
    let groupState = useStatelyToggleGroupState({
      disallowEmptySelection: true,
      onSelectionChange: (keys) => {
        let values = Array.from(keys).map((key) => String(key));
        groupSelectionChanges.push(values);
        selectedKeys.value = new Set(values);
      },
      selectedKeys,
      selectionMode: 'multiple'
    });

    groupState.toggleKey('italic');
    expect(Array.from(groupState.selectedKeys.value)).toEqual(['bold', 'italic']);
    groupState.toggleKey('bold');
    expect(Array.from(groupState.selectedKeys.value)).toEqual(['italic']);
    groupState.toggleKey('italic');
    expect(Array.from(groupState.selectedKeys.value)).toEqual(['italic']);

    let singleGroupState = useStatelyToggleGroupState({
      defaultSelectedKeys: ['left'],
      selectionMode: 'single'
    });
    singleGroupState.toggleKey('right');
    expect(Array.from(singleGroupState.selectedKeys.value)).toEqual(['right']);
    expect(groupSelectionChanges).toEqual([['bold', 'italic'], ['italic'], ['italic']]);
  });

  it('matches vue-stately toggle-group setter and disabled semantics with React', () => {
    let disabledGroupState = useStatelyToggleGroupState({
      defaultSelectedKeys: ['bold'],
      isDisabled: true,
      selectionMode: 'multiple'
    });

    disabledGroupState.toggleKey('italic');
    expect(Array.from(disabledGroupState.selectedKeys.value)).toEqual(['bold', 'italic']);

    let singleGroupState = useStatelyToggleGroupState({
      defaultSelectedKeys: ['left'],
      disallowEmptySelection: true,
      selectionMode: 'single'
    });

    singleGroupState.setSelectedKeys(new Set(['left', 'right']));
    expect(Array.from(singleGroupState.selectedKeys.value)).toEqual(['left', 'right']);

    singleGroupState.setSelectedKeys(new Set());
    expect(Array.from(singleGroupState.selectedKeys.value)).toEqual([]);

    singleGroupState.toggleKey('left');
    expect(Array.from(singleGroupState.selectedKeys.value)).toEqual(['left']);

    // disallowEmptySelection is enforced by toggle interactions, not direct setSelectedKeys writes.
    singleGroupState.toggleKey('left');
    expect(Array.from(singleGroupState.selectedKeys.value)).toEqual(['left']);
  });

  it('keeps vue-stately toggle hooks controlled without mutating control refs', () => {
    let controlledSelected = ref<boolean | undefined>(true);
    let toggleChanges: boolean[] = [];
    let toggleState = useStatelyToggleState({
      isSelected: controlledSelected,
      onChange: (isSelected) => {
        toggleChanges.push(isSelected);
      }
    });

    toggleState.toggle();
    toggleState.toggle();
    expect(controlledSelected.value).toBe(true);
    expect(toggleState.isSelected.value).toBe(true);
    expect(toggleChanges).toEqual([false]);

    let controlledSelectedKeys = ref<Set<string | number> | undefined>(new Set(['bold']));
    let groupChanges: string[][] = [];
    let groupState = useStatelyToggleGroupState({
      onSelectionChange: (keys) => {
        groupChanges.push(Array.from(keys).map((key) => String(key)));
      },
      selectedKeys: controlledSelectedKeys,
      selectionMode: 'multiple'
    });

    groupState.toggleKey('italic');
    expect(Array.from(controlledSelectedKeys.value ?? [])).toEqual(['bold']);
    expect(Array.from(groupState.selectedKeys.value)).toEqual(['bold']);
    expect(groupChanges).toEqual([['bold', 'italic']]);
  });

  it('suppresses duplicate vue-stately toggle-group controlled callbacks for the same update in one turn', () => {
    let controlledSelectedKeys = ref<Set<string | number> | undefined>(new Set(['bold']));
    let groupChanges: string[][] = [];
    let groupState = useStatelyToggleGroupState({
      onSelectionChange: (keys) => {
        groupChanges.push(Array.from(keys).map((key) => String(key)));
      },
      selectedKeys: controlledSelectedKeys,
      selectionMode: 'multiple'
    });

    let requestedKeys = new Set<string | number>(['bold', 'italic']);
    groupState.setSelectedKeys(requestedKeys);
    groupState.setSelectedKeys(requestedKeys);

    expect(Array.from(controlledSelectedKeys.value ?? [])).toEqual(['bold']);
    expect(Array.from(groupState.selectedKeys.value)).toEqual(['bold']);
    expect(groupChanges).toEqual([['bold', 'italic']]);
  });

  it('warns when vue-stately toggle hooks switch between controlled and uncontrolled', async () => {
    let warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    try {
      let controlledSelected = ref<boolean | undefined>(true);
      useStatelyToggleState({
        isSelected: controlledSelected
      });

      controlledSelected.value = undefined;
      await nextTick();
      expect(warnSpy).toHaveBeenLastCalledWith('WARN: A component changed from controlled to uncontrolled.');

      controlledSelected.value = false;
      await nextTick();
      expect(warnSpy).toHaveBeenLastCalledWith('WARN: A component changed from uncontrolled to controlled.');

      let controlledSelectedKeys = ref<Set<string | number> | undefined>(new Set(['bold']));
      useStatelyToggleGroupState({
        selectedKeys: controlledSelectedKeys
      });

      controlledSelectedKeys.value = undefined;
      await nextTick();
      expect(warnSpy).toHaveBeenLastCalledWith('WARN: A component changed from controlled to uncontrolled.');

      controlledSelectedKeys.value = new Set(['italic']);
      await nextTick();
      expect(warnSpy).toHaveBeenLastCalledWith('WARN: A component changed from uncontrolled to controlled.');
    } finally {
      warnSpy.mockRestore();
    }
  });

  it('keeps vue-stately toggle group uncontrolled when selectedKeys ref is undefined', () => {
    let selectedKeysRef = ref<Set<string | number> | undefined>(undefined);
    let groupChanges: string[][] = [];
    let groupState = useStatelyToggleGroupState({
      defaultSelectedKeys: ['bold'],
      onSelectionChange: (keys) => {
        groupChanges.push(Array.from(keys).map((key) => String(key)));
      },
      selectedKeys: selectedKeysRef,
      selectionMode: 'multiple'
    });

    groupState.toggleKey('italic');

    expect(selectedKeysRef.value).toBeUndefined();
    expect(Array.from(groupState.selectedKeys.value)).toEqual(['bold', 'italic']);
    expect(groupChanges).toEqual([['bold', 'italic']]);
  });

  it('manages vue-stately tooltip trigger warmup and close delay behavior', () => {
    vi.useFakeTimers();

    try {
      let isOpen = ref(false);
      let openChanges: boolean[] = [];
      let tooltipState = useStatelyTooltipTriggerState({
        delay: 100,
        closeDelay: 60,
        isOpen,
        onOpenChange: (nextOpen) => {
          openChanges.push(nextOpen);
          isOpen.value = nextOpen;
        }
      });

      tooltipState.open();
      expect(tooltipState.isOpen.value).toBe(false);
      vi.advanceTimersByTime(99);
      expect(tooltipState.isOpen.value).toBe(false);
      vi.advanceTimersByTime(1);
      expect(tooltipState.isOpen.value).toBe(true);

      tooltipState.close();
      expect(tooltipState.isOpen.value).toBe(true);
      vi.advanceTimersByTime(59);
      expect(tooltipState.isOpen.value).toBe(true);
      vi.advanceTimersByTime(1);
      expect(tooltipState.isOpen.value).toBe(false);

      let immediateTooltipState = useStatelyTooltipTriggerState({
        closeDelay: 0,
        delay: 250
      });
      immediateTooltipState.open(true);
      expect(immediateTooltipState.isOpen.value).toBe(true);
      immediateTooltipState.close();
      expect(immediateTooltipState.isOpen.value).toBe(false);

      expect(openChanges).toEqual([true, false]);
    } finally {
      vi.runAllTimers();
      vi.useRealTimers();
    }
  });

  it('resets vue-stately tooltip warmup when open is called repeatedly', () => {
    vi.useFakeTimers();

    try {
      vi.runAllTimers();

      let isOpen = ref(false);
      let openChanges: boolean[] = [];
      let tooltipState = useStatelyTooltipTriggerState({
        delay: 1000,
        isOpen,
        onOpenChange: (nextOpen) => {
          openChanges.push(nextOpen);
          isOpen.value = nextOpen;
        }
      });

      tooltipState.open(false);
      vi.advanceTimersByTime(600);
      expect(tooltipState.isOpen.value).toBe(false);

      tooltipState.open(false);
      vi.advanceTimersByTime(400);
      expect(tooltipState.isOpen.value).toBe(false);
      expect(openChanges).toEqual([]);

      vi.advanceTimersByTime(600);
      expect(tooltipState.isOpen.value).toBe(true);
      expect(openChanges).toEqual([true]);
    } finally {
      vi.runAllTimers();
      vi.useRealTimers();
    }
  });

  it('closes vue-stately tooltip immediately when closeDelay is zero or negative', () => {
    vi.useFakeTimers();

    try {
      let zeroDelayTooltipState = useStatelyTooltipTriggerState({
        closeDelay: 0,
        delay: 0
      });
      zeroDelayTooltipState.open(true);
      expect(zeroDelayTooltipState.isOpen.value).toBe(true);
      zeroDelayTooltipState.close();
      expect(zeroDelayTooltipState.isOpen.value).toBe(false);

      let negativeDelayTooltipState = useStatelyTooltipTriggerState({
        closeDelay: -50,
        delay: 0
      });
      negativeDelayTooltipState.open(true);
      expect(negativeDelayTooltipState.isOpen.value).toBe(true);
      negativeDelayTooltipState.close();
      expect(negativeDelayTooltipState.isOpen.value).toBe(false);
    } finally {
      vi.runAllTimers();
      vi.useRealTimers();
    }
  });

  it('closes previously opened vue-stately controlled tooltip when another opens', () => {
    vi.useFakeTimers();

    try {
      let firstIsOpen = ref(false);
      let secondIsOpen = ref(false);
      let firstChanges: boolean[] = [];
      let secondChanges: boolean[] = [];

      let firstTooltip = useStatelyTooltipTriggerState({
        delay: 1000,
        isOpen: firstIsOpen,
        onOpenChange: (nextOpen) => {
          firstChanges.push(nextOpen);
          firstIsOpen.value = nextOpen;
        }
      });
      let secondTooltip = useStatelyTooltipTriggerState({
        delay: 1000,
        isOpen: secondIsOpen,
        onOpenChange: (nextOpen) => {
          secondChanges.push(nextOpen);
          secondIsOpen.value = nextOpen;
        }
      });

      firstTooltip.open(false);
      vi.advanceTimersByTime(1000);
      expect(firstTooltip.isOpen.value).toBe(true);
      expect(firstChanges).toEqual([true]);

      secondTooltip.open(false);
      expect(firstTooltip.isOpen.value).toBe(false);
      expect(secondTooltip.isOpen.value).toBe(true);
      expect(firstChanges).toEqual([true, false]);
      expect(secondChanges).toEqual([true]);
    } finally {
      vi.runAllTimers();
      vi.useRealTimers();
    }
  });

  it('manages vue-stately tree collection expansion and selection behavior', () => {
    let expandedKeys = ref<Set<string | number> | undefined>(new Set(['animals']));
    let expandedChanges: string[][] = [];
    let treeState = useStatelyTreeState({
      expandedKeys,
      items: [
        {
          key: 'animals',
          childNodes: [
            {
              key: 'mammals',
              childNodes: [
                {key: 'bear'}
              ]
            },
            {key: 'birds'}
          ]
        },
        {key: 'plants'}
      ],
      onExpandedChange: (nextKeys) => {
        let values = Array.from(nextKeys).map((key) => String(key));
        expandedChanges.push(values);
        expandedKeys.value = new Set(values);
      },
      selectionMode: 'multiple'
    });

    expect(Array.from(treeState.collection.getKeys())).toEqual([
      'animals',
      'mammals',
      'birds',
      'plants'
    ]);

    treeState.toggleKey('mammals');
    expect(Array.from(treeState.collection.getKeys())).toEqual([
      'animals',
      'mammals',
      'bear',
      'birds',
      'plants'
    ]);
    expect(expandedChanges).toEqual([['animals', 'mammals']]);

    treeState.selectionManager.toggleSelection('birds');
    treeState.selectionManager.toggleSelection('bear');
    expect(Array.from(treeState.selectionManager.selectedKeys)).toEqual(['birds', 'bear']);

    treeState.selectionManager.setFocusedKey('bear');
    treeState.setExpandedKeys(new Set(['animals']));
    treeState.setExpandedKeys(new Set(['animals']));
    expect(treeState.selectionManager.focusedKey).toBeNull();
    expect(Array.from(treeState.collection.getKeys())).toEqual([
      'animals',
      'mammals',
      'birds',
      'plants'
    ]);
    expect(expandedChanges).toEqual([['animals', 'mammals'], ['animals'], ['animals']]);
  });

  it('syncs vue-stately tree collection when controlled expandedKeys change externally', async () => {
    let expandedKeys = ref<Set<string | number> | undefined>(new Set(['animals']));
    let treeState = useStatelyTreeState({
      expandedKeys,
      items: [
        {
          key: 'animals',
          childNodes: [
            {
              key: 'mammals',
              childNodes: [
                {key: 'bear'}
              ]
            },
            {key: 'birds'}
          ]
        },
        {key: 'plants'}
      ],
      selectionMode: 'none'
    });

    expect(Array.from(treeState.collection.getKeys())).toEqual([
      'animals',
      'mammals',
      'birds',
      'plants'
    ]);

    expandedKeys.value = new Set(['animals', 'mammals']);
    await nextTick();

    expect(Array.from(treeState.collection.getKeys())).toEqual([
      'animals',
      'mammals',
      'bear',
      'birds',
      'plants'
    ]);
  });

  it('syncs vue-stately tree disabled keys when disabledKeys prop changes', async () => {
    let options = reactive({
      disabledKeys: [] as string[],
      items: [
        {
          key: 'animals',
          childNodes: [
            {key: 'birds'}
          ]
        },
        {key: 'plants'}
      ],
      selectionMode: 'multiple' as const
    });

    let treeState = useStatelyTreeState(options);
    expect(treeState.selectionManager.isDisabled('birds')).toBe(false);
    expect(treeState.disabledKeys.has('birds')).toBe(false);

    options.disabledKeys = ['birds'];
    await nextTick();

    expect(treeState.selectionManager.isDisabled('birds')).toBe(true);
    expect(treeState.disabledKeys.has('birds')).toBe(true);
  });

  it('keeps vue-stately tree controlled without mutating expanded key refs', () => {
    let expandedKeys = ref<Set<string | number> | undefined>(new Set(['animals']));
    let expandedChanges: string[][] = [];
    let treeState = useStatelyTreeState({
      expandedKeys,
      items: [
        {
          key: 'animals',
          childNodes: [
            {
              key: 'mammals',
              childNodes: [
                {key: 'bear'}
              ]
            },
            {key: 'birds'}
          ]
        },
        {key: 'plants'}
      ],
      onExpandedChange: (nextKeys) => {
        expandedChanges.push(Array.from(nextKeys).map((key) => String(key)));
      },
      selectionMode: 'none'
    });

    treeState.toggleKey('mammals');

    expect(Array.from(expandedKeys.value ?? [])).toEqual(['animals']);
    expect(Array.from(treeState.collection.getKeys())).toEqual([
      'animals',
      'mammals',
      'birds',
      'plants'
    ]);
    expect(expandedChanges).toEqual([['animals', 'mammals']]);
  });

  it('suppresses duplicate vue-stately tree controlled callbacks for the same update in one turn', () => {
    let expandedKeys = ref<Set<string | number> | undefined>(new Set(['animals']));
    let expandedChanges: string[][] = [];
    let treeState = useStatelyTreeState({
      expandedKeys,
      items: [
        {
          key: 'animals',
          childNodes: [
            {
              key: 'mammals',
              childNodes: [
                {key: 'bear'}
              ]
            },
            {key: 'birds'}
          ]
        },
        {key: 'plants'}
      ],
      onExpandedChange: (nextKeys) => {
        expandedChanges.push(Array.from(nextKeys).map((key) => String(key)));
      },
      selectionMode: 'none'
    });

    let requestedKeys = new Set<string | number>(['animals', 'mammals']);
    treeState.setExpandedKeys(requestedKeys);
    treeState.setExpandedKeys(requestedKeys);

    expect(Array.from(expandedKeys.value ?? [])).toEqual(['animals']);
    expect(Array.from(treeState.collection.getKeys())).toEqual([
      'animals',
      'mammals',
      'birds',
      'plants'
    ]);
    expect(expandedChanges).toEqual([['animals', 'mammals']]);
  });

  it('warns when vue-stately tree expandedKeys switches between controlled and uncontrolled', async () => {
    let warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    let expandedKeys = ref<Set<string> | undefined>(new Set(['animals']));
    useStatelyTreeState({
      expandedKeys,
      items: [
        {
          key: 'animals',
          childNodes: [
            {key: 'mammals'}
          ]
        }
      ],
      selectionMode: 'none'
    });

    try {
      expandedKeys.value = undefined;
      await nextTick();
      expect(warnSpy).toHaveBeenLastCalledWith('WARN: A component changed from controlled to uncontrolled.');

      expandedKeys.value = new Set(['animals']);
      await nextTick();
      expect(warnSpy).toHaveBeenLastCalledWith('WARN: A component changed from uncontrolled to controlled.');
    } finally {
      warnSpy.mockRestore();
    }
  });

  it('keeps vue-stately tree expansion uncontrolled when expandedKeys ref is undefined', () => {
    let expandedKeys = ref<Set<string> | undefined>(undefined);
    let treeState = useStatelyTreeState({
      defaultExpandedKeys: ['animals'],
      expandedKeys,
      items: [
        {
          key: 'animals',
          childNodes: [
            {
              key: 'mammals',
              childNodes: [
                {key: 'bear'}
              ]
            }
          ]
        }
      ],
      selectionMode: 'none'
    });

    treeState.toggleKey('mammals');

    expect(expandedKeys.value).toBeUndefined();
    expect(Array.from(treeState.collection.getKeys())).toEqual(['animals', 'mammals', 'bear']);
  });

  it('manages vue-stately utility state and numeric helper behavior', () => {
    let controlledValue = ref<string | undefined>('alpha');
    let changeEvents: string[] = [];
    let [controlledState, setControlledState] = useStatelyControlledState(
      controlledValue,
      'default',
      (nextValue) => {
        changeEvents.push(nextValue);
        controlledValue.value = nextValue;
      }
    );

    expect(controlledState.value).toBe('alpha');
    setControlledState((currentValue) => `${currentValue}-next`);
    expect(controlledState.value).toBe('alpha-next');
    setControlledState('alpha-next');
    expect(changeEvents).toEqual(['alpha-next']);

    let [uncontrolledState, setUncontrolledState] = useStatelyControlledState<number>(undefined, 2);
    setUncontrolledState((currentValue) => currentValue + 3);
    expect(uncontrolledState.value).toBe(5);

    let uncontrolledRefValue = ref<string | undefined>(undefined);
    let [uncontrolledRefState, setUncontrolledRefState] = useStatelyControlledState(uncontrolledRefValue, 'fallback');
    setUncontrolledRefState('updated');
    expect(uncontrolledRefState.value).toBe('updated');
    expect(uncontrolledRefValue.value).toBeUndefined();

    expect(clampStatelyNumber(8, 0, 5)).toBe(5);
    expect(roundStatelyStepPrecision(0.123456789, 1e-7)).toBe(0.12345679);
    expect(snapStatelyValueToStep(2, -0.5, 100, 3)).toBe(2.5);
    expect(toStatelyFixedNumber(Math.PI, 2)).toBe(3.14);
  });

  it('matches vue-stately controlled-state callback semantics for controlled props', async () => {
    let controlledValue = ref<string | undefined>('controlledValue');
    let changeEvents: string[] = [];
    let [state, setState] = useStatelyControlledState(
      controlledValue,
      'defaultValue',
      (nextValue) => {
        changeEvents.push(nextValue);
      }
    );

    expect(state.value).toBe('controlledValue');

    controlledValue.value = 'updated';
    await nextTick();
    expect(state.value).toBe('updated');

    setState((prevValue) => {
      expect(prevValue).toBe('updated');
      return `${prevValue}-newValue`;
    });
    setState((prevValue) => {
      expect(prevValue).toBe('updated-newValue');
      return `${prevValue}-wombat`;
    });

    expect(changeEvents).toEqual(['updated-newValue', 'updated-newValue-wombat']);
    expect(state.value).toBe('updated');

    await nextTick();

    setState((prevValue) => {
      expect(prevValue).toBe('updated');
      return 'newValue';
    });
    await nextTick();
    setState((prevValue) => {
      expect(prevValue).toBe('updated');
      return 'newValue';
    });
    await nextTick();
    setState((prevValue) => {
      expect(prevValue).toBe('updated');
      return 'updated';
    });

    expect(changeEvents).toEqual(['updated-newValue', 'updated-newValue-wombat', 'newValue', 'newValue']);
    expect(state.value).toBe('updated');
  });

  it('warns when vue-stately controlled state toggles between controlled and uncontrolled', async () => {
    let warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    let controlledValue = ref<string | undefined>('controlled');
    let [controlledState] = useStatelyControlledState(controlledValue, 'default');

    try {
      expect(controlledState.value).toBe('controlled');

      controlledValue.value = undefined;
      await nextTick();
      expect(warnSpy).toHaveBeenLastCalledWith('WARN: A component changed from controlled to uncontrolled.');

      controlledValue.value = 'next';
      await nextTick();
      expect(warnSpy).toHaveBeenLastCalledWith('WARN: A component changed from uncontrolled to controlled.');
    } finally {
      warnSpy.mockRestore();
    }
  });

  it('warns that vue-aria useDrag1D is deprecated', () => {
    let warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    try {
      useAriaDrag1D({
        containerRef: {current: document.createElement('div')},
        onPositionChange: () => {}
      });

      expect(warnSpy).toHaveBeenCalledWith('useDrag1D is deprecated, please use `useMove` instead https://react-spectrum.adobe.com/react-aria/useMove.html');
    } finally {
      warnSpy.mockRestore();
    }
  });

  it('manages vue-stately virtualizer layout geometry and visible view state', () => {
    type VirtualizedItem = {id: string};

    class FixedRowLayout extends StatelyVirtualizerLayout<VirtualizedItem> {
      private layoutInfos = new Map<string, StatelyLayoutInfo>();

      constructor(private items: VirtualizedItem[]) {
        super();

        for (let index = 0; index < items.length; index++) {
          let item = items[index];
          this.layoutInfos.set(
            item.id,
            new StatelyLayoutInfo('item', item.id, new StatelyVirtualizerRect(0, index * 20, 100, 20))
          );
        }
      }

      getVisibleLayoutInfos(rect: StatelyVirtualizerRect): StatelyLayoutInfo[] {
        return this.items
          .map((item) => this.layoutInfos.get(item.id))
          .filter((layoutInfo): layoutInfo is StatelyLayoutInfo => layoutInfo != null && layoutInfo.rect.intersects(rect));
      }

      getLayoutInfo(key: string | number): StatelyLayoutInfo | null {
        return this.layoutInfos.get(String(key)) ?? null;
      }

      getContentSize(): StatelyVirtualizerSize {
        return new StatelyVirtualizerSize(100, this.items.length * 20);
      }
    }

    let items: VirtualizedItem[] = [
      {id: 'one'},
      {id: 'two'},
      {id: 'three'},
      {id: 'four'}
    ];
    let byId = new Map(items.map((item) => [item.id, item]));
    let virtualizerState = useStatelyVirtualizerState({
      collection: {
        getItem: (key) => byId.get(String(key)) ?? null,
        getKeys: () => items.map((item) => item.id)
      },
      layout: new FixedRowLayout(items),
      renderView: (type, content) => `${type}:${content?.id ?? 'none'}`
    });

    virtualizerState.setVisibleRect(new StatelyVirtualizerRect(0, 0, 100, 45));
    expect(virtualizerState.visibleViews.value.map((view) => view.layoutInfo?.key)).toEqual([
      'one',
      'two',
      'three'
    ]);
    expect(virtualizerState.contentSize.value.height).toBe(80);

    virtualizerState.startScrolling();
    expect(virtualizerState.isScrolling.value).toBe(true);
    virtualizerState.endScrolling();
    expect(virtualizerState.isScrolling.value).toBe(false);

    let visibleKey = virtualizerState.virtualizer.keyAtPoint(new StatelyVirtualizerPoint(10, 10));
    expect(visibleKey).toBe('one');

    let copiedLayout = virtualizerState.visibleViews.value[0]?.layoutInfo?.copy();
    expect(copiedLayout?.rect.equals(new StatelyVirtualizerRect(0, 0, 100, 20))).toBe(true);

    virtualizerState.setVisibleRect(new StatelyVirtualizerRect(0, 60, 100, 20));
    expect(virtualizerState.visibleViews.value.map((view) => view.layoutInfo?.key)).toEqual(['three', 'four']);
  });

  it('manages vue-aria virtualizer helper and wrapper contracts', () => {
    let virtualizer = useAriaVirtualizer({
      itemCount: ref(8),
      itemHeight: 20,
      viewportHeight: 60,
      scrollTop: ref(10),
      overscan: 1
    });

    expect(virtualizer.startIndex.value).toBe(0);
    expect(virtualizer.endIndex.value).toBe(5);
    expect(virtualizer.visibleIndexes.value).toEqual([0, 1, 2, 3, 4]);
    expect(virtualizer.totalHeight.value).toBe(160);
    expect(virtualizer.offsetTop.value).toBe(0);

    let styledLayout = ariaLayoutInfoToStyle({left: 4, top: 8}, 'ltr', null);
    expect(styledLayout).toMatchObject({left: 4, top: 8});
    expect(getAriaRTLOffsetType()).toBe('negative');

    let scroller = document.createElement('div');
    scroller.scrollLeft = -24;
    expect(getAriaScrollLeft(scroller, 'rtl')).toBe(24);
    setAriaScrollLeft(scroller, 'rtl', 12);
    expect(scroller.scrollLeft).toBe(-12);
    setAriaScrollLeft(scroller, 'ltr', 6);
    expect(scroller.scrollLeft).toBe(6);

    let scrollView = useAriaScrollView();
    expect(scrollView.scrollViewProps).toEqual({});

    let virtualizerItem = useAriaVirtualizerItem({});
    expect(typeof virtualizerItem.updateSize).toBe('function');
    expect((virtualizerItem as {virtualizerItemProps?: unknown}).virtualizerItemProps).toEqual({});

    let wrapper = mount({
      components: {AriaVirtualizer, AriaVirtualizerItem, AriaVirtualizerScrollView},
      template: `
        <AriaVirtualizer>
          <AriaVirtualizerScrollView>
            <AriaVirtualizerItem>
              <span class="vs-virtualizer-cell">Cell</span>
            </AriaVirtualizerItem>
          </AriaVirtualizerScrollView>
        </AriaVirtualizer>
      `
    });

    expect(wrapper.find('.vs-virtualizer-cell').exists()).toBe(true);
  });

  it('computes vue-aria grid semantics plus row and cell selection behavior', () => {
    let rowActions: string[] = [];
    let cellActions: string[] = [];
    let selectedKeys = ref(new Set<string>());
    let collection = {
      columnCount: 2,
      rows: [
        {
          key: 'row-1',
          index: 0,
          textValue: 'Backlog',
          cells: [
            {key: 'row-1-cell-1', colIndex: 0, textValue: 'Backlog'},
            {key: 'row-1-cell-2', colIndex: 1, textValue: 'Open'}
          ]
        },
        {
          key: 'row-2',
          index: 1,
          textValue: 'Done',
          cells: [
            {key: 'row-2-cell-1', colIndex: 0, textValue: 'Done'},
            {key: 'row-2-cell-2', colIndex: 1, textValue: 'Closed'}
          ]
        }
      ]
    };

    let grid = useGrid({
      ariaLabel: 'Tickets',
      collection,
      isVirtualized: true,
      onCellAction: (key) => {
        cellActions.push(key);
      },
      onRowAction: (key) => {
        rowActions.push(key);
      },
      selectedKeys,
      selectionMode: 'multiple'
    });

    expect(grid.gridProps.value.role).toBe('grid');
    expect(grid.gridProps.value['aria-multiselectable']).toBe('true');
    expect(grid.gridProps.value['aria-rowcount']).toBe(2);
    expect(grid.keyboardDelegate.value.getKeyBelow('row-1')).toBe('row-2');

    let dashedAriaGrid = useGrid({
      'aria-label': 'Dashed tickets',
      collection,
      selectionMode: 'none'
    });
    expect(dashedAriaGrid.gridProps.value['aria-label']).toBe('Dashed tickets');

    let warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    useGrid({
      collection,
      selectionMode: 'none'
    });
    expect(warn).toHaveBeenCalledWith('An aria-label or aria-labelledby prop is required for accessibility.');
    warn.mockRestore();

    let row = useGridRow({
      grid,
      isVirtualized: true,
      row: collection.rows[0]
    });
    row.press();
    expect(row.rowProps.value['aria-rowindex']).toBe(1);
    expect(Array.from(selectedKeys.value)).toEqual(['row-1']);
    expect(rowActions).toEqual(['row-1']);

    let cell = useGridCell({
      cell: collection.rows[0].cells[0],
      grid,
      isVirtualized: true,
      row: collection.rows[0]
    });
    cell.focus();
    expect(grid.focusedKey.value).toBe('row-1-cell-1');
    cell.press();
    expect(cellActions).toEqual(['row-1-cell-1']);

    let checkbox = useGridSelectionCheckbox({
      grid,
      key: 'row-1'
    });
    checkbox.toggleSelection();
    expect(selectedKeys.value.size).toBe(1);

    let rowGroup = useGridRowGroup();
    expect(rowGroup.rowGroupProps.value.role).toBe('rowgroup');
  });

  it('moves vue-aria grid focus and toggles row selection from keyboard input', () => {
    let selectedKeys = ref(new Set<string>());
    let collection = {
      columnCount: 2,
      rows: [
        {
          key: 'row-1',
          index: 0,
          textValue: 'Alpha',
          cells: [
            {key: 'row-1-cell-1', colIndex: 0, textValue: 'Alpha'},
            {key: 'row-1-cell-2', colIndex: 1, textValue: 'Open'}
          ]
        },
        {
          key: 'row-2',
          index: 1,
          textValue: 'Delta',
          cells: [
            {key: 'row-2-cell-1', colIndex: 0, textValue: 'Delta'},
            {key: 'row-2-cell-2', colIndex: 1, textValue: 'Closed'}
          ]
        }
      ]
    };

    let grid = useGrid({
      ariaLabel: 'Tickets',
      collection,
      focusMode: 'cell',
      selectedKeys,
      selectionMode: 'multiple'
    });

    grid.gridProps.value.onKeyDown(new KeyboardEvent('keydown', {key: 'ArrowDown'}));
    expect(grid.focusedKey.value).toBe('row-1-cell-1');

    grid.gridProps.value.onKeyDown(new KeyboardEvent('keydown', {key: 'ArrowRight'}));
    expect(grid.focusedKey.value).toBe('row-1-cell-2');

    grid.gridProps.value.onKeyDown(new KeyboardEvent('keydown', {key: ' '}));
    expect(Array.from(selectedKeys.value)).toEqual(['row-1']);

    grid.gridProps.value.onKeyDown(new KeyboardEvent('keydown', {key: 'ArrowDown'}));
    expect(grid.focusedKey.value).toBe('row-2-cell-2');

    grid.gridProps.value.onKeyDown(new KeyboardEvent('keydown', {key: 'Home'}));
    expect(grid.focusedKey.value).toBe('row-1-cell-1');

    grid.gridProps.value.onKeyDown(new KeyboardEvent('keydown', {key: 'End'}));
    expect(grid.focusedKey.value).toBe('row-2-cell-2');
  });

  it('builds vue-aria grid descriptions, announcements, and keyboard navigation', () => {
    let collection = {
      columnCount: 2,
      rows: [
        {
          key: 'row-1',
          index: 0,
          textValue: 'Alpha',
          cells: [
            {key: 'row-1-cell-1', colIndex: 0, textValue: 'Alpha'},
            {key: 'row-1-cell-2', colIndex: 1, textValue: 'Open'}
          ]
        },
        {
          key: 'row-2',
          index: 1,
          textValue: 'Delta',
          cells: [
            {key: 'row-2-cell-1', colIndex: 0, textValue: 'Delta'},
            {key: 'row-2-cell-2', colIndex: 1, textValue: 'Closed'}
          ]
        }
      ]
    };

    let description = useHighlightSelectionDescription({
      hasItemActions: true,
      interactionModality: 'pointer',
      selectionBehavior: 'replace',
      selectionMode: 'multiple'
    });
    expect(description.descriptionProps.value['aria-description']).toBe('Long press to select items.');

    let selectedKeys = ref(new Set<string>());
    let announcement = useGridSelectionAnnouncement({}, {
      collection,
      isFocused: true,
      selectedKeys,
      selectionMode: 'multiple'
    });

    selectedKeys.value = new Set(['row-1']);
    announcement.syncAnnouncement();
    expect(announcement.announcement.value).toContain('Alpha selected.');

    selectedKeys.value = new Set(['row-1', 'row-2']);
    announcement.syncAnnouncement();
    expect(announcement.announcement.value).toContain('2 items selected.');

    let keyboardDelegate = new GridKeyboardDelegate({
      collection,
      focusMode: 'cell'
    });
    expect(keyboardDelegate.getKeyRightOf('row-1')).toBe('row-1-cell-1');
    expect(keyboardDelegate.getKeyBelow('row-1-cell-1')).toBe('row-2-cell-1');
    expect(keyboardDelegate.getKeyForSearch('de')).toBe('row-2-cell-1');
  });

  it('computes vue-aria gridlist semantics, item state, and section props', () => {
    let actions: string[] = [];
    let selectedKeys = ref(new Set<string>());
    let collection = {
      items: [
        {key: 'story-1', index: 0, textValue: 'Story 1', description: 'First story'},
        {key: 'story-2', index: 1, textValue: 'Story 2'}
      ]
    };

    let gridList = useGridList({
      ariaLabel: 'Stories',
      collection,
      isVirtualized: true,
      onAction: (key) => {
        actions.push(key);
      },
      selectedKeys,
      selectionMode: 'multiple'
    });

    expect(gridList.gridProps.value.role).toBe('grid');
    expect(gridList.gridProps.value['aria-rowcount']).toBe(2);

    let dashedAriaGridList = useGridList({
      'aria-label': 'Queued stories',
      collection,
      selectionMode: 'none'
    });
    expect(dashedAriaGridList.gridProps.value['aria-label']).toBe('Queued stories');

    let warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    useGridList({
      collection,
      selectionMode: 'none'
    });
    expect(warn).toHaveBeenCalledWith('An aria-label or aria-labelledby prop is required for accessibility.');
    warn.mockRestore();

    let item = useGridListItem({
      gridList,
      isVirtualized: true,
      item: collection.items[0]
    });
    item.press();
    expect(actions).toEqual(['story-1']);
    expect(item.rowProps.value.id).toContain('story-1');
    expect(item.rowProps.value['aria-selected']).toBe(true);
    expect(item.gridCellProps.value.role).toBe('gridcell');

    let selectionCheckbox = useGridListSelectionCheckbox({
      gridList,
      key: 'story-1'
    });
    selectionCheckbox.toggleSelection();
    expect(selectedKeys.value.size).toBe(0);
    expect(selectionCheckbox.checkboxProps.value['aria-labelledby']).toContain('story-1');

    let section = useGridListSection({
      ariaLabel: 'Open stories'
    });
    expect(section.rowProps.value.role).toBe('row');
    expect(section.rowHeaderProps.value.role).toBe('rowheader');
    expect(section.rowGroupProps.value.role).toBe('rowgroup');
    expect(section.rowGroupProps.value['aria-label']).toBe('Open stories');
    let sectionLabelledByIds = section.rowGroupProps.value['aria-labelledby']?.split(/\s+/) ?? [];
    expect(sectionLabelledByIds).toContain(section.rowHeaderProps.value.id);
    expect(sectionLabelledByIds).toContain(section.rowGroupProps.value.id as string);

    let dashedAriaSection = useGridListSection({
      'aria-label': 'Queued stories'
    });
    expect(dashedAriaSection.rowGroupProps.value['aria-label']).toBe('Queued stories');
  });

  it('formats locale-sensitive values with vue-aria i18n helpers', () => {
    let provider = I18nProvider({
      locale: 'fr-FR'
    });

    expect(useLocale().locale).toBe('fr-FR');
    expect(isRTL('ar-EG')).toBe(true);
    expect(useDefaultLocale().locale.length).toBeGreaterThan(0);

    let collator = useCollator({
      sensitivity: 'base',
      usage: 'search'
    });
    expect(collator.compare('é', 'e')).toBe(0);

    let filter = useFilter();
    expect(filter.contains('Vue Spectrum', 'spectrum')).toBe(false);
    expect(filter.startsWith('Migration', 'mig')).toBe(false);

    let caseInsensitiveFilter = useFilter({
      sensitivity: 'base'
    });
    expect(caseInsensitiveFilter.contains('Vue Spectrum', 'spectrum')).toBe(true);
    expect(caseInsensitiveFilter.startsWith('Migration', 'mig')).toBe(true);

    let listFormatter = useListFormatter({
      style: 'long',
      type: 'conjunction'
    });
    expect(listFormatter.format(['Vue', 'React']).length).toBeGreaterThan(0);

    let numberFormatter = useNumberFormatter({
      maximumFractionDigits: 1
    });
    expect(numberFormatter.format(12.34).length).toBeGreaterThan(0);

    let dateFormatter = useDateFormatter({
      day: 'numeric',
      month: 'short',
      timeZone: 'UTC'
    });
    expect(dateFormatter.format(new Date(Date.UTC(2026, 1, 14))).length).toBeGreaterThan(0);

    let strings = {
      'en-US': {
        greeting: 'Hello {name}'
      },
      'fr-FR': {
        greeting: 'Bonjour {name}'
      }
    };
    let messageFormatter = useMessageFormatter(strings);
    expect(messageFormatter('greeting', {name: 'Codex'})).toBe('Bonjour Codex');

    let localizedFormatter = useLocalizedStringFormatter(strings);
    expect(localizedFormatter.format('greeting', {name: 'Vue'})).toBe('Bonjour Vue');

    provider.clear();
  });

  it('computes vue-aria label and field accessibility relationships', () => {
    let label = useLabel({
      label: 'Email address'
    });

    expect(label.labelProps.value.id).toBeDefined();
    expect(label.labelProps.value.htmlFor).toBe(label.fieldProps.value.id);
    expect(label.fieldProps.value['aria-labelledby']).toContain(label.labelProps.value.id as string);

    let ariaOnlyLabel = useLabel({
      'aria-label': 'Support code'
    });
    expect(ariaOnlyLabel.labelProps.value.id).toBeUndefined();
    expect(ariaOnlyLabel.fieldProps.value['aria-label']).toBe('Support code');

    let composedLabel = useLabel({
      'aria-label': 'Support code',
      'aria-labelledby': 'support-code-label',
      label: 'Support'
    });
    let composedLabelledBy = composedLabel.fieldProps.value['aria-labelledby']?.split(/\s+/) ?? [];
    expect(composedLabel.fieldProps.value['aria-label']).toBe('Support code');
    expect(composedLabelledBy).toContain('support-code-label');
    expect(composedLabelledBy).toContain(composedLabel.labelProps.value.id as string);
    expect(composedLabelledBy).toContain(composedLabel.fieldProps.value.id);

    let field = useField({
      ariaDescribedby: 'legacy-help',
      description: 'Provide your strongest password.',
      errorMessage: 'Password is required.',
      isInvalid: true,
      label: 'Password'
    });

    let describedBy = field.fieldProps.value['aria-describedby'] ?? '';
    expect(describedBy).toContain(field.descriptionProps.value.id);
    expect(describedBy).toContain(field.errorMessageProps.value.id);
    expect(describedBy).toContain('legacy-help');
    expect(field.fieldProps.value['aria-labelledby']).toContain(field.labelProps.value.id as string);
  });

  it('navigates vue-aria landmarks with the landmark controller', () => {
    let main = document.createElement('main');
    let navigation = document.createElement('nav');
    main.tabIndex = -1;
    navigation.tabIndex = -1;
    document.body.append(main, navigation);

    let mainFocused = 0;
    let navigationFocused = 0;

    let mainRef = ref<Element | null>(main);
    let navigationRef = ref<Element | null>(navigation);

    let mainLandmark = useLandmark({
      'aria-label': 'Main content',
      focus: () => {
        mainFocused += 1;
      },
      role: 'main'
    }, mainRef);

    let navigationLandmark = useLandmark({
      'aria-label': 'Primary navigation',
      focus: () => {
        navigationFocused += 1;
      },
      role: 'navigation'
    }, navigationRef);

    let controller = UNSTABLE_createLandmarkController();

    try {
      expect(mainLandmark.landmarkProps.value.role).toBe('main');
      expect(navigationLandmark.landmarkProps.value.role).toBe('navigation');
      expect(controller.focusMain()).toBe(true);
      expect(mainFocused).toBe(1);
      expect(document.activeElement).toBe(main);

      expect(controller.focusNext({from: main})).toBe(true);
      expect(navigationFocused).toBe(1);
      expect(document.activeElement).toBe(navigation);

      expect(controller.focusPrevious({from: navigation})).toBe(true);
      expect(mainFocused).toBe(2);
      expect(document.activeElement).toBe(main);
    } finally {
      controller.dispose();
      document.body.removeChild(main);
      document.body.removeChild(navigation);
    }
  });

  it('warns on landmark role conflicts and duplicate unlabeled roles', () => {
    let mainA = document.createElement('main');
    let mainB = document.createElement('main');
    let navA = document.createElement('nav');
    let navB = document.createElement('nav');
    document.body.append(mainA, mainB, navA, navB);

    let warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    let error = vi.spyOn(console, 'error').mockImplementation(() => {});

    try {
      useLandmark({
        'aria-label': 'Main A',
        role: 'main'
      }, ref(mainA));
      useLandmark({
        'aria-label': 'Main B',
        role: 'main'
      }, ref(mainB));
      useLandmark({
        role: 'navigation'
      }, ref(navA));
      useLandmark({
        role: 'navigation'
      }, ref(navB));

      expect(error).toHaveBeenCalledWith('Page can contain no more than one landmark with the role "main".');
      expect(warn).toHaveBeenCalledWith(expect.stringContaining("Page contains more than one landmark with the 'navigation' role."), expect.any(Array));
    } finally {
      error.mockRestore();
      warn.mockRestore();
      document.body.removeChild(mainA);
      document.body.removeChild(mainB);
      document.body.removeChild(navA);
      document.body.removeChild(navB);
    }
  });

  it('applies vue-aria link semantics and press interactions', () => {
    let pressCount = 0;
    let customLink = useAriaLink({
      elementType: 'span',
      onPress: () => {
        pressCount += 1;
      }
    });

    expect(customLink.linkProps.value.role).toBe('link');
    expect(customLink.linkProps.value.tabindex).toBe(0);
    expect(customLink.linkProps.value.href).toBeUndefined();

    let span = document.createElement('span');
    document.body.append(span);

    try {
      if (customLink.linkProps.value.onKeyDown) {
        span.addEventListener('keydown', customLink.linkProps.value.onKeyDown as EventListener);
      }
      if (customLink.linkProps.value.onKeyUp) {
        span.addEventListener('keyup', customLink.linkProps.value.onKeyUp as EventListener);
      }
      if (customLink.linkProps.value.onClick) {
        span.addEventListener('click', customLink.linkProps.value.onClick as EventListener);
      }

      span.dispatchEvent(new KeyboardEvent('keydown', {bubbles: true, key: 'Enter'}));
      span.dispatchEvent(new KeyboardEvent('keyup', {bubbles: true, key: 'Enter'}));
      span.dispatchEvent(new MouseEvent('click', {bubbles: true, cancelable: true}));
      expect(pressCount).toBe(2);
    } finally {
      document.body.removeChild(span);
    }

    let disabledLink = useAriaLink({
      href: '/docs',
      isDisabled: true
    });

    let anchor = document.createElement('a');
    if (disabledLink.linkProps.value.onClick) {
      anchor.addEventListener('click', disabledLink.linkProps.value.onClick as EventListener);
    }

    let disabledClickEvent = new MouseEvent('click', {bubbles: true, cancelable: true});
    anchor.dispatchEvent(disabledClickEvent);
    expect(disabledLink.linkProps.value['aria-disabled']).toBe(true);
    expect(disabledLink.linkProps.value.href).toBeUndefined();
    expect(disabledClickEvent.defaultPrevented).toBe(true);
  });

  it('computes vue-aria listbox options, sections, and list data ids', () => {
    let actionEvents: Array<string> = [];
    let selectedKeys = ref(new Set<string>());

    let listBox = useAriaListBox({
      isVirtualized: true,
      label: 'Frameworks',
      onAction: (key) => {
        actionEvents.push(String(key));
      },
      selectionMode: 'multiple',
      shouldFocusOnHover: true,
      shouldSelectOnPressUp: true
    }, {
      items: [
        {key: 'react', index: 0, textValue: 'React'},
        {key: 'vue', index: 1, textValue: 'Vue', description: 'Current migration target'}
      ]
    }, selectedKeys);

    expect(listBox.listBoxProps.value.role).toBe('listbox');
    expect(listBox.listBoxProps.value['aria-multiselectable']).toBe('true');
    expect(listData.get(listBox as unknown as object)?.id).toBe(listBox.listBoxProps.value.id);

    let option = useAriaOption({
      key: 'vue'
    }, listBox);

    option.optionProps.value.onMouseEnter();
    expect(listBox.focusedKey.value).toBe('vue');
    option.optionProps.value.onMouseDown();
    option.optionProps.value.onMouseUp();
    expect(selectedKeys.value.has('vue')).toBe(true);
    expect(actionEvents).toEqual(['vue']);
    expect(option.optionProps.value.id).toBe(getItemId(listBox as unknown as object, 'vue'));
    expect(option.optionProps.value['aria-posinset']).toBe(2);
    expect(option.optionProps.value['aria-setsize']).toBe(2);

    let section = useAriaListBoxSection({
      'aria-label': 'Primary options',
      heading: 'Core frameworks'
    });
    expect(section.itemProps.value.role).toBe('presentation');
    expect(section.headingProps.value.role).toBe('presentation');
    expect(section.groupProps.value.role).toBe('group');
    expect(section.groupProps.value['aria-labelledby']).toBe(section.headingProps.value.id);

    let composedLabelListBox = useAriaListBox({
      'aria-label': 'Framework picker',
      'aria-labelledby': 'external-framework-listbox-label',
      id: 'framework-listbox',
      label: 'Frameworks',
      selectionMode: 'single'
    }, {
      items: [
        {key: 'react', index: 0, textValue: 'React'}
      ]
    });

    let listBoxLabelledByIds = composedLabelListBox.listBoxProps.value['aria-labelledby']?.split(/\s+/) ?? [];
    expect(listBoxLabelledByIds).toContain('framework-listbox-label');
    expect(listBoxLabelledByIds).toContain('external-framework-listbox-label');
    expect(listBoxLabelledByIds).toContain('framework-listbox');
    expect(composedLabelListBox.listBoxProps.value['aria-label']).toBe('Framework picker');
  });

  it('computes vue-aria menu trigger and item selection semantics', () => {
    let openChanges: boolean[] = [];
    let menuTrigger = useMenuTrigger({
      onOpenChange: (isOpen) => {
        openChanges.push(isOpen);
      }
    });
    expect(menuTrigger.isOpen.value).toBe(false);
    menuTrigger.menuTriggerProps.value.onKeyDown(new KeyboardEvent('keydown', {key: 'ArrowDown'}));
    expect(menuTrigger.isOpen.value).toBe(true);
    expect(menuTrigger.menuProps.value['aria-labelledby']).toBe(menuTrigger.menuTriggerProps.value.id);
    menuTrigger.open();
    expect(openChanges).toEqual([true]);
    menuTrigger.close();
    expect(menuTrigger.isOpen.value).toBe(false);
    menuTrigger.menuTriggerProps.value.onKeyDown(new KeyboardEvent('keydown', {key: 'ArrowUp'}));
    expect(menuTrigger.isOpen.value).toBe(true);
    menuTrigger.close();
    expect(openChanges).toEqual([true, false, true, false]);

    let disabledOpen = ref(true);
    let disabledMenuTrigger = useMenuTrigger({
      isDisabled: true,
      isOpen: disabledOpen
    });
    disabledMenuTrigger.close();
    expect(disabledOpen.value).toBe(false);
    disabledMenuTrigger.open();
    expect(disabledOpen.value).toBe(false);
    disabledOpen.value = true;
    disabledMenuTrigger.menuTriggerProps.value.onKeyDown(new KeyboardEvent('keydown', {key: 'Escape'}));
    expect(disabledOpen.value).toBe(false);
    disabledMenuTrigger.menuTriggerProps.value.onKeyDown(new KeyboardEvent('keydown', {key: 'ArrowDown'}));
    expect(disabledOpen.value).toBe(false);

    let actionEvents: string[] = [];
    let selectedKeys = ref(new Set<string>());
    let menu = useAriaMenu({
      ariaLabel: 'Item actions',
      onAction: (key) => {
        actionEvents.push(String(key));
      },
      selectedKeys,
      selectionMode: 'multiple'
    });

    let item = useAriaMenuItem({
      key: 'duplicate',
      onAction: (key) => {
        actionEvents.push(`item:${String(key)}`);
      }
    }, menu);

    expect(menu.menuProps.value.role).toBe('menu');
    expect(menu.menuProps.value['aria-label']).toBe('Item actions');

    let dashedMenu = useAriaMenu({
      'aria-label': 'More actions',
      selectionMode: 'none'
    });
    expect(dashedMenu.menuProps.value['aria-label']).toBe('More actions');

    let warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    useAriaMenu({
      selectionMode: 'none'
    });
    expect(warn).toHaveBeenCalledWith('An aria-label or aria-labelledby prop is required for accessibility.');
    warn.mockRestore();

    expect(item.menuItemProps.value.role).toBe('menuitemcheckbox');
    expect(item.menuItemProps.value['aria-selected']).toBeUndefined();

    item.menuItemProps.value.onFocus();
    expect(item.isFocused.value).toBe(true);
    item.menuItemProps.value.onMouseDown();
    expect(item.isPressed.value).toBe(true);
    item.menuItemProps.value.onMouseUp();
    expect(item.isPressed.value).toBe(false);
    item.menuItemProps.value.onClick();
    expect(selectedKeys.value.has('duplicate')).toBe(true);
    expect(actionEvents).toEqual(['item:duplicate', 'duplicate']);
    expect(item.menuItemProps.value['aria-checked']).toBe(true);
    expect(item.menuItemProps.value['aria-selected']).toBeUndefined();

    let plainItem = useAriaMenuItem({
      key: 'plain-item'
    }, dashedMenu);
    expect(plainItem.menuItemProps.value.role).toBe('menuitem');
    expect(plainItem.menuItemProps.value['aria-checked']).toBeUndefined();
    expect(plainItem.menuItemProps.value['aria-selected']).toBeUndefined();

    let section = useMenuSection({
      heading: 'Edit options'
    });
    expect(section.itemProps.value.role).toBe('presentation');
    expect(section.groupProps.value.role).toBe('group');
    expect(section.groupProps.value['aria-labelledby']).toBe(section.headingProps.value.id);

    let submenuTrigger = useSubmenuTrigger();
    expect(submenuTrigger.submenuTriggerProps.value['aria-haspopup']).toBe('menu');
    submenuTrigger.submenuTriggerProps.value.onMouseEnter();
    expect(submenuTrigger.isOpen.value).toBe(true);
    submenuTrigger.submenuTriggerProps.value.onKeyDown(new KeyboardEvent('keydown', {key: 'Escape'}));
    expect(submenuTrigger.isOpen.value).toBe(false);

    let submenuOpenChanges: boolean[] = [];
    let trackedSubmenuTrigger = useSubmenuTrigger({
      onOpenChange: (nextOpen) => {
        submenuOpenChanges.push(nextOpen);
      }
    });
    trackedSubmenuTrigger.open();
    trackedSubmenuTrigger.open();
    trackedSubmenuTrigger.close();
    trackedSubmenuTrigger.close();
    expect(submenuOpenChanges).toEqual([true, false]);

    let disabledSubmenuOpen = ref(true);
    let disabledSubmenuTrigger = useSubmenuTrigger({
      isDisabled: true,
      isOpen: disabledSubmenuOpen
    });
    expect(disabledSubmenuTrigger.submenuTriggerProps.value['aria-haspopup']).toBeUndefined();
    disabledSubmenuTrigger.close();
    expect(disabledSubmenuOpen.value).toBe(false);
    disabledSubmenuTrigger.open();
    expect(disabledSubmenuOpen.value).toBe(false);
  });

  it('computes vue-aria meter range, labels, and value text', () => {
    let meter = useAriaMeter({
      label: 'Upload progress',
      maxValue: 80,
      minValue: 0,
      value: 40
    });

    expect(meter.meterProps.value.role).toBe('meter progressbar');
    expect(meter.meterProps.value['aria-valuemin']).toBe(0);
    expect(meter.meterProps.value['aria-valuemax']).toBe(80);
    expect(meter.meterProps.value['aria-valuenow']).toBe(40);
    expect(meter.percentage.value).toBe(0.5);
    expect(meter.meterProps.value['aria-valuetext']).toContain('50');
    expect(meter.meterProps.value['aria-labelledby']).toBe(meter.labelProps.value.id);

    let clampedMeter = useAriaMeter({
      maxValue: 10,
      minValue: 2,
      value: 40
    });
    expect(clampedMeter.value.value).toBe(10);
    expect(clampedMeter.meterProps.value['aria-valuenow']).toBe(10);

    let explicitValueLabelMeter = useAriaMeter({
      'aria-label': 'Storage meter',
      maxValue: 10,
      minValue: 0,
      value: 3,
      valueLabel: '3 of 10 GB'
    });
    expect(explicitValueLabelMeter.meterProps.value['aria-label']).toBe('Storage meter');
    expect(explicitValueLabelMeter.meterProps.value['aria-valuetext']).toBe('3 of 10 GB');

    let composedLabelMeter = useAriaMeter({
      'aria-label': 'Storage meter',
      'aria-labelledby': 'external-meter-label',
      label: 'Upload progress',
      maxValue: 80,
      minValue: 0,
      value: 40
    });
    let composedLabelledByIds = composedLabelMeter.meterProps.value['aria-labelledby']?.split(/\s+/) ?? [];
    expect(composedLabelledByIds).toContain('external-meter-label');
    expect(composedLabelledByIds).toContain(composedLabelMeter.labelProps.value.id);
    expect(composedLabelledByIds).toContain(composedLabelMeter.meterProps.value.id);
  });

  it('computes vue-aria number field stepping and clamped input behavior', () => {
    let changedValues: number[] = [];
    let numberField = useAriaNumberField({
      label: 'Story points',
      maxValue: 10,
      minValue: 0,
      onChange: (value) => {
        changedValues.push(value);
      },
      step: 2,
      value: ref(4)
    });

    expect(numberField.inputProps.value.role).toBe('spinbutton');
    expect(numberField.inputProps.value['aria-valuenow']).toBe(4);
    expect(numberField.inputProps.value['aria-labelledby']).toBe(numberField.labelProps.value.id);
    expect(numberField.incrementButtonProps.value['aria-label']).toBe('Increase Story points');
    expect(numberField.decrementButtonProps.value['aria-label']).toBe('Decrease Story points');
    expect(numberField.incrementButtonProps.value['aria-controls']).toBe(numberField.inputProps.value.id);
    expect(numberField.decrementButtonProps.value['aria-controls']).toBe(numberField.inputProps.value.id);

    numberField.increment();
    expect(numberField.numberValue.value).toBe(6);
    numberField.decrementButtonProps.value.onClick();
    expect(numberField.numberValue.value).toBe(4);

    numberField.inputProps.value.onInput('14');
    numberField.inputProps.value.onBlur();
    expect(numberField.numberValue.value).toBe(10);

    numberField.inputProps.value.onKeyDown(new KeyboardEvent('keydown', {key: 'ArrowDown'}));
    expect(numberField.numberValue.value).toBe(8);

    numberField.inputProps.value.onInput('abc');
    expect(numberField.isInvalid.value).toBe(true);
    expect(numberField.groupProps.value['aria-invalid']).toBe(true);
    numberField.commit();
    expect(numberField.inputValue.value).toContain('8');
    expect(numberField.isInvalid.value).toBe(false);
    expect(numberField.groupProps.value['aria-invalid']).toBeUndefined();
    expect(changedValues).toEqual([6, 4, 10, 8]);
  });

  it('composes vue-aria number field labelledby ownership and stepper labelling parity', () => {
    let composedLabelNumberField = useAriaNumberField({
      'aria-label': 'Estimate',
      'aria-labelledby': 'external-estimate-label',
      label: 'Story points',
      id: 'estimate-input',
      value: ref(1)
    });

    let inputLabelledByIds = composedLabelNumberField.inputProps.value['aria-labelledby']?.split(/\s+/) ?? [];
    expect(inputLabelledByIds).toContain('estimate-input-label');
    expect(inputLabelledByIds).toContain('external-estimate-label');
    expect(inputLabelledByIds).toContain('estimate-input');
    expect(composedLabelNumberField.inputProps.value['aria-label']).toBe('Estimate');

    expect(composedLabelNumberField.incrementButtonProps.value['aria-label']).toBe('Increase Estimate');
    expect(composedLabelNumberField.incrementButtonProps.value.id).toBeUndefined();
    expect(composedLabelNumberField.incrementButtonProps.value['aria-labelledby']).toBeUndefined();

    let labelledByOnlyNumberField = useAriaNumberField({
      'aria-labelledby': 'external-estimate-label',
      id: 'estimate-no-label',
      value: ref(1)
    });

    expect(labelledByOnlyNumberField.incrementButtonProps.value['aria-label']).toBe('Increase');
    expect(labelledByOnlyNumberField.decrementButtonProps.value['aria-label']).toBe('Decrease');
    expect(labelledByOnlyNumberField.incrementButtonProps.value.id).toBe('estimate-no-label-increment');
    expect(labelledByOnlyNumberField.decrementButtonProps.value.id).toBe('estimate-no-label-decrement');
    expect(labelledByOnlyNumberField.incrementButtonProps.value['aria-labelledby']).toBe('estimate-no-label-increment external-estimate-label');
    expect(labelledByOnlyNumberField.decrementButtonProps.value['aria-labelledby']).toBe('estimate-no-label-decrement external-estimate-label');
  });

  it('computes vue-aria overlay trigger, popover, modal, and scroll lock semantics', () => {
    let previousMarkup = document.body.innerHTML;
    let previousOverflow = document.documentElement.style.overflow;
    let previousPaddingRight = document.documentElement.style.paddingRight;
    document.body.innerHTML = '<main data-testid=\"app-shell\"></main><button data-testid=\"trigger\"></button><div data-testid=\"popover\"></div><div data-testid=\"modal\"></div>';

    let appShell = document.querySelector('[data-testid=\"app-shell\"]');
    let triggerElement = document.querySelector('[data-testid=\"trigger\"]');
    let popoverElement = document.querySelector('[data-testid=\"popover\"]');
    let modalElement = document.querySelector('[data-testid=\"modal\"]');

    if (
      !(appShell instanceof HTMLElement) ||
      !(triggerElement instanceof HTMLElement) ||
      !(popoverElement instanceof HTMLElement) ||
      !(modalElement instanceof HTMLElement)
    ) {
      throw new Error('Expected overlay test nodes to exist');
    }

    triggerElement.getBoundingClientRect = () => createDOMRect(100, 120, 48, 20);
    popoverElement.getBoundingClientRect = () => createDOMRect(0, 0, 180, 120);
    modalElement.getBoundingClientRect = () => createDOMRect(20, 20, 280, 200);

    let triggerRef = ref<HTMLElement | null>(triggerElement);
    let popoverRef = ref<HTMLElement | null>(popoverElement);
    let modalRef = ref<HTMLElement | null>(modalElement);

    let overlayTrigger = useAriaOverlayTrigger({
      type: 'menu'
    });
    let overlay = useAriaOverlay({
      isDismissable: true,
      isOpen: overlayTrigger.isOpen,
      onClose: overlayTrigger.close,
      overlayRef: popoverRef
    });
    let overlayPosition = useAriaOverlayPosition({
      isOpen: overlayTrigger.isOpen,
      overlayRef: popoverRef,
      placement: 'bottom start',
      targetRef: triggerRef
    });

    overlayTrigger.triggerProps.value.onClick();
    expect(overlayTrigger.isOpen.value).toBe(true);
    overlayPosition.updatePosition();
    expect(overlayPosition.overlayProps.value.style.position).toBe('absolute');
    expect(overlayPosition.triggerAnchorPoint.value).not.toBeNull();

    overlay.overlayProps.value.onKeyDown(new KeyboardEvent('keydown', {key: 'Escape'}));
    expect(overlayTrigger.isOpen.value).toBe(false);

    let popoverOpen = ref(true);
    let popover = useAriaPopover({
      isOpen: popoverOpen,
      onClose: () => {
        popoverOpen.value = false;
      },
      placement: 'bottom',
      popoverRef,
      triggerRef
    });
    expect(popover.popoverProps.value.role).toBe('dialog');
    expect(popover.placement.value).toBe('bottom');

    let modalOpen = ref(true);
    let modalOverlay = useAriaModalOverlay({
      isDismissable: true,
      isOpen: modalOpen,
      modalRef,
      onClose: () => {
        modalOpen.value = false;
      }
    });
    expect(modalOverlay.modalProps.value['data-ismodal']).toBe(true);
    expect(modalOverlay.modalProps.value.role).toBe('dialog');

    let scrollLock = useAriaPreventScroll();
    expect(scrollLock.isPreventingScroll.value).toBe(true);

    scrollLock.dispose();
    modalOverlay.dispose();
    popover.dispose();
    overlayPosition.dispose();
    overlay.dispose();

    let restoreHidden = ariaHideOutsideOverlays([modalElement]);
    expect(appShell.getAttribute('aria-hidden')).toBe('true');
    restoreHidden();
    expect(appShell.getAttribute('aria-hidden')).toBeNull();

    document.documentElement.style.overflow = previousOverflow;
    document.documentElement.style.paddingRight = previousPaddingRight;
    document.body.innerHTML = previousMarkup;
  });

  it('keeps composing Escape open and dismisses overlays via outside interactions', () => {
    let overlayElement = document.createElement('div');
    let outsideElement = document.createElement('button');
    document.body.append(overlayElement, outsideElement);

    let isOpen = ref(true);
    let closeCount = 0;
    let overlay = useAriaOverlay({
      isDismissable: true,
      isOpen,
      onClose: () => {
        closeCount += 1;
        isOpen.value = false;
      },
      overlayRef: ref(overlayElement)
    });

    try {
      let composingEscape = new KeyboardEvent('keydown', {key: 'Escape'});
      Object.defineProperty(composingEscape, 'isComposing', {value: true});
      overlay.overlayProps.value.onKeyDown(composingEscape);
      expect(closeCount).toBe(0);
      expect(isOpen.value).toBe(true);

      overlay.overlayProps.value.onKeyDown(new KeyboardEvent('keydown', {key: 'Escape'}));
      expect(closeCount).toBe(1);
      expect(isOpen.value).toBe(false);

      isOpen.value = true;
      if (typeof PointerEvent !== 'undefined') {
        outsideElement.dispatchEvent(createPointerEvent('pointerdown'));
        outsideElement.dispatchEvent(new MouseEvent('click', {bubbles: true}));
      } else {
        outsideElement.dispatchEvent(new MouseEvent('mousedown', {bubbles: true}));
        outsideElement.dispatchEvent(new MouseEvent('mouseup', {bubbles: true}));
      }

      expect(closeCount).toBe(2);
      expect(isOpen.value).toBe(false);
    } finally {
      overlay.dispose();
      document.body.removeChild(overlayElement);
      document.body.removeChild(outsideElement);
    }
  });

  it('binds overlay listeners to the overlay owner document', () => {
    let iframe = document.createElement('iframe');
    document.body.appendChild(iframe);
    let iframeDocument = iframe.contentWindow?.document;
    expect(iframeDocument).toBeTruthy();
    let overlayElement = iframeDocument!.createElement('div');
    iframeDocument!.body.appendChild(overlayElement);
    let addListenerOnIframe = vi.spyOn(iframeDocument!, 'addEventListener');
    let addListenerOnDocument = vi.spyOn(document, 'addEventListener');

    let overlay = useAriaOverlay({
      isDismissable: true,
      isOpen: ref(true),
      overlayRef: ref(overlayElement)
    });

    try {
      let iframeEventTypes = addListenerOnIframe.mock.calls.map(([type]) => type as string);
      let documentEventTypes = addListenerOnDocument.mock.calls.map(([type]) => type as string);

      expect(iframeEventTypes).toEqual(expect.arrayContaining(['focusin', 'keydown']));
      expect(documentEventTypes).not.toContain('focusin');
      expect(documentEventTypes).not.toContain('keydown');

      if (typeof PointerEvent !== 'undefined') {
        expect(iframeEventTypes).toEqual(expect.arrayContaining(['pointerdown', 'click']));
        expect(documentEventTypes).not.toContain('pointerdown');
        expect(documentEventTypes).not.toContain('click');
      } else {
        expect(iframeEventTypes).toEqual(expect.arrayContaining(['mousedown', 'mouseup', 'touchstart', 'touchend']));
        expect(documentEventTypes).not.toContain('mousedown');
        expect(documentEventTypes).not.toContain('mouseup');
        expect(documentEventTypes).not.toContain('touchstart');
        expect(documentEventTypes).not.toContain('touchend');
      }
    } finally {
      overlay.dispose();
      addListenerOnIframe.mockRestore();
      addListenerOnDocument.mockRestore();
      iframe.remove();
    }
  });

  it('honors overlay dismissability and outside-interaction predicates', () => {
    let overlayElement = document.createElement('div');
    let outsideElement = document.createElement('button');
    document.body.append(overlayElement, outsideElement);

    let runCase = (options: {isDismissable: boolean, shouldCloseOnInteractOutside?: (element: Element) => boolean}) => {
      let isOpen = ref(true);
      let closeCount = 0;
      let overlay = useAriaOverlay({
        isDismissable: options.isDismissable,
        isOpen,
        onClose: () => {
          closeCount += 1;
          isOpen.value = false;
        },
        overlayRef: ref(overlayElement),
        shouldCloseOnInteractOutside: options.shouldCloseOnInteractOutside
      });

      try {
        dispatchOutsideInteraction(outsideElement);
        return closeCount;
      } finally {
        overlay.dispose();
      }
    };

    try {
      expect(runCase({isDismissable: true})).toBe(1);
      expect(runCase({
        isDismissable: true,
        shouldCloseOnInteractOutside: () => false
      })).toBe(0);
      expect(runCase({
        isDismissable: true,
        shouldCloseOnInteractOutside: (element) => element === outsideElement
      })).toBe(1);
      expect(runCase({isDismissable: false})).toBe(0);
    } finally {
      document.body.removeChild(overlayElement);
      document.body.removeChild(outsideElement);
    }
  });

  it('only dismisses the top-most open overlay on outside interaction', () => {
    let overlayElementOne = document.createElement('div');
    let overlayElementTwo = document.createElement('div');
    let outsideElement = document.createElement('button');
    document.body.append(overlayElementOne, overlayElementTwo, outsideElement);

    let firstOpen = ref(true);
    let secondOpen = ref(true);
    let firstCloseCount = 0;
    let secondCloseCount = 0;
    let firstOverlay = useAriaOverlay({
      isDismissable: true,
      isOpen: firstOpen,
      onClose: () => {
        firstCloseCount += 1;
        firstOpen.value = false;
      },
      overlayRef: ref(overlayElementOne)
    });
    let secondOverlay = useAriaOverlay({
      isDismissable: true,
      isOpen: secondOpen,
      onClose: () => {
        secondCloseCount += 1;
        secondOpen.value = false;
      },
      overlayRef: ref(overlayElementTwo)
    });

    try {
      dispatchOutsideInteraction(outsideElement);
      expect(secondCloseCount).toBe(1);
      expect(firstCloseCount).toBe(0);

      secondOverlay.dispose();
      dispatchOutsideInteraction(outsideElement);
      expect(firstCloseCount).toBe(1);
    } finally {
      firstOverlay.dispose();
      secondOverlay.dispose();
      document.body.removeChild(overlayElementOne);
      document.body.removeChild(overlayElementTwo);
      document.body.removeChild(outsideElement);
    }
  });

  it('closes overlays from Escape even when isDismissable is false', () => {
    let isOpen = ref(true);
    let closeCount = 0;
    let overlay = useAriaOverlay({
      isDismissable: false,
      isOpen,
      onClose: () => {
        closeCount += 1;
        isOpen.value = false;
      }
    });

    try {
      overlay.overlayProps.value.onKeyDown(new KeyboardEvent('keydown', {key: 'Escape'}));
      expect(closeCount).toBe(1);
      expect(isOpen.value).toBe(false);
    } finally {
      overlay.dispose();
    }
  });

  it('computes vue-aria progress semantics for determinate and indeterminate bars', () => {
    let progressBar = useAriaProgressBar({
      label: 'Upload progress',
      maxValue: 80,
      minValue: 0,
      value: 40
    });

    expect(progressBar.progressBarProps.value.role).toBe('progressbar');
    expect(progressBar.progressBarProps.value['aria-valuemin']).toBe(0);
    expect(progressBar.progressBarProps.value['aria-valuemax']).toBe(80);
    expect(progressBar.progressBarProps.value['aria-valuenow']).toBe(40);
    expect(progressBar.percentage.value).toBe(0.5);
    expect(progressBar.progressBarProps.value['aria-valuetext']).toContain('50');
    expect(progressBar.progressBarProps.value['aria-labelledby']).toBe(progressBar.labelProps.value.id);

    let indeterminateProgressBar = useAriaProgressBar({
      ariaLabel: 'Loading',
      isIndeterminate: true,
      value: 10
    });
    expect(indeterminateProgressBar.progressBarProps.value['aria-label']).toBe('Loading');
    expect(indeterminateProgressBar.progressBarProps.value['aria-valuenow']).toBeUndefined();
    expect(indeterminateProgressBar.progressBarProps.value['aria-valuetext']).toBeUndefined();
  });

  it('computes vue-aria radio group selection and keyboard movement', () => {
    let selectionChanges: string[] = [];
    let selectedValue = ref<string | null>(null);
    let radioGroup = useAriaRadioGroup({
      label: 'Framework',
      onChange: (value) => {
        selectionChanges.push(value);
      },
      selectedValue
    });
    let reactRadio = useAriaRadio({
      children: 'React',
      onChange: () => {
        selectionChanges.push('item:react');
      },
      value: 'react'
    }, radioGroup);
    let vueRadio = useAriaRadio({
      children: 'Vue',
      value: 'vue'
    }, radioGroup);
    let disabledRadio = useAriaRadio({
      children: 'Svelte',
      isDisabled: true,
      value: 'svelte'
    }, radioGroup);

    expect(radioGroup.radioGroupProps.value.role).toBe('radiogroup');
    expect(reactRadio.inputProps.value.tabIndex).toBe(0);
    expect(vueRadio.inputProps.value.tabIndex).toBe(-1);
    expect(disabledRadio.inputProps.value.disabled).toBe(true);
    expect(radioGroup.radioGroupProps.value['aria-labelledby']).toBe(radioGroup.labelProps.value.id);

    reactRadio.inputProps.value.onChange();
    expect(selectedValue.value).toBe('react');
    expect(reactRadio.isSelected.value).toBe(true);
    expect(selectionChanges).toEqual(['react', 'item:react']);

    reactRadio.inputProps.value.onChange();
    expect(selectionChanges).toEqual(['react', 'item:react']);

    let targetInput = document.createElement('input');
    targetInput.type = 'radio';
    targetInput.value = 'react';
    let rightArrow = {
      key: 'ArrowRight',
      preventDefault: () => {},
      composedPath: () => [targetInput]
    } as unknown as KeyboardEvent;
    radioGroup.radioGroupProps.value.onKeyDown(rightArrow);
    expect(selectedValue.value).toBe('vue');
    expect(selectionChanges).toEqual(['react', 'item:react', 'vue']);

    let rtlProvider = I18nProvider({
      locale: 'ar-EG'
    });
    try {
      let rtlSelectedValue = ref<string | null>('b');
      let rtlRadioGroup = useAriaRadioGroup({
        orientation: 'horizontal',
        selectedValue: rtlSelectedValue
      });
      let rtlRadioA = useAriaRadio({
        children: 'A',
        value: 'a'
      }, rtlRadioGroup);
      let rtlRadioB = useAriaRadio({
        children: 'B',
        value: 'b'
      }, rtlRadioGroup);
      let rtlRadioC = useAriaRadio({
        children: 'C',
        value: 'c'
      }, rtlRadioGroup);

      let rtlTargetInput = document.createElement('input');
      rtlTargetInput.type = 'radio';
      rtlTargetInput.value = 'b';
      let rtlRightArrow = {
        key: 'ArrowRight',
        preventDefault: () => {},
        composedPath: () => [rtlTargetInput]
      } as unknown as KeyboardEvent;
      rtlRadioGroup.radioGroupProps.value.onKeyDown(rtlRightArrow);
      expect(rtlSelectedValue.value).toBe('a');

      rtlRadioA.dispose();
      rtlRadioB.dispose();
      rtlRadioC.dispose();
    } finally {
      rtlProvider.clear();
    }

    vueRadio.inputProps.value.onMouseDown();
    expect(vueRadio.isPressed.value).toBe(true);
    vueRadio.inputProps.value.onMouseUp();
    expect(vueRadio.isPressed.value).toBe(false);

    disabledRadio.inputProps.value.onChange();
    expect(selectedValue.value).toBe('vue');

    reactRadio.dispose();
    vueRadio.dispose();
    disabledRadio.dispose();
  });

  it('composes vue-aria radio group and radio input labelling parity', () => {
    let selectedValue = ref<string | null>('react');
    let radioGroup = useAriaRadioGroup({
      'aria-label': 'Framework',
      'aria-labelledby': 'external-radio-group-label',
      label: 'Library',
      id: 'framework-group',
      selectedValue
    });

    let groupLabelledByIds = radioGroup.radioGroupProps.value['aria-labelledby']?.split(/\s+/) ?? [];
    expect(groupLabelledByIds).toContain('framework-group-label');
    expect(groupLabelledByIds).toContain('external-radio-group-label');
    expect(groupLabelledByIds).toContain('framework-group');
    expect(radioGroup.radioGroupProps.value['aria-label']).toBe('Framework');

    let reactRadio = useAriaRadio({
      'aria-labelledby': 'external-react-radio-label',
      value: 'react'
    }, radioGroup);
    expect(reactRadio.inputProps.value['aria-labelledby']).toBe('external-react-radio-label');
    reactRadio.dispose();
  });

  it('warns when vue-aria radio is missing visible children and aria label', () => {
    let warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    let radioGroup = useAriaRadioGroup({
      label: 'Framework'
    });

    let radio = useAriaRadio({
      value: 'react'
    }, radioGroup);

    expect(warnSpy).toHaveBeenCalledWith('If you do not provide children, you must specify an aria-label for accessibility');

    radio.dispose();
    warnSpy.mockRestore();
  });

  it('computes vue-aria search field submit and clear behavior', () => {
    let inputValue = ref('vue');
    let submitValues: string[] = [];
    let clearCount = 0;
    let searchField = useAriaSearchField({
      inputValue,
      label: 'Search docs',
      onClear: () => {
        clearCount += 1;
      },
      onSubmit: (value) => {
        submitValues.push(value);
      }
    });

    expect(searchField.inputProps.value.type).toBe('search');
    let preventEnterDefault = vi.fn();
    searchField.inputProps.value.onKeyDown({
      key: 'Enter',
      preventDefault: preventEnterDefault
    } as unknown as KeyboardEvent);
    expect(submitValues).toEqual(['vue']);
    expect(preventEnterDefault).toHaveBeenCalledTimes(1);

    let preventEscapeDefault = vi.fn();
    searchField.inputProps.value.onKeyDown({
      key: 'Escape',
      preventDefault: preventEscapeDefault
    } as unknown as KeyboardEvent);
    expect(inputValue.value).toBe('');
    expect(clearCount).toBe(1);
    expect(preventEscapeDefault).toHaveBeenCalledTimes(1);
    expect(searchField.clearButtonProps.value.disabled).toBe(false);
    expect(searchField.clearButtonProps.value.tabIndex).toBe(-1);

    let searchInput = document.createElement('input');
    document.body.append(searchInput);
    searchField.inputRef.value = searchInput;

    let preventPointerDefault = vi.fn();
    searchField.clearButtonProps.value.onPointerDown({
      preventDefault: preventPointerDefault
    } as unknown as PointerEvent);
    expect(preventPointerDefault).toHaveBeenCalledTimes(1);
    expect(document.activeElement).toBe(searchInput);

    let preventTouchDefault = vi.fn();
    searchField.clearButtonProps.value.onTouchStart({
      preventDefault: preventTouchDefault
    } as unknown as TouchEvent);
    expect(preventTouchDefault).toHaveBeenCalledTimes(1);
    expect(document.activeElement).toBe(searchInput);

    let continueEscapePropagation = vi.fn();
    let preventEscapeWhenEmpty = vi.fn();
    searchField.inputProps.value.onKeyDown({
      key: 'Escape',
      continuePropagation: continueEscapePropagation,
      preventDefault: preventEscapeWhenEmpty
    } as unknown as KeyboardEvent);
    expect(continueEscapePropagation).toHaveBeenCalledTimes(1);
    expect(preventEscapeWhenEmpty).not.toHaveBeenCalled();

    searchField.inputProps.value.onInput('react');
    expect(inputValue.value).toBe('react');
    searchField.clearButtonProps.value.onClick();
    expect(inputValue.value).toBe('');
    expect(clearCount).toBe(2);
    searchField.clearButtonProps.value.onClick();
    expect(clearCount).toBe(3);

    let composedLabelSearchField = useAriaSearchField({
      'aria-label': 'Search query',
      'aria-labelledby': 'search-label',
      inputValue: ref(''),
      label: 'Search docs'
    });
    let composedLabelledByIds = composedLabelSearchField.inputProps.value['aria-labelledby']?.split(/\s+/) ?? [];
    expect(composedLabelSearchField.inputProps.value['aria-label']).toBe('Search query');
    expect(composedLabelledByIds).toContain(composedLabelSearchField.labelProps.value.id as string);
    expect(composedLabelledByIds).toContain('search-label');
    expect(composedLabelledByIds).toContain(composedLabelSearchField.inputProps.value.id);

    let ariaLabelOnlySearchField = useAriaSearchField({
      'aria-label': 'Search query',
      'aria-labelledby': 'search-label',
      inputValue: ref('')
    });
    let ariaLabelOnlyIds = ariaLabelOnlySearchField.inputProps.value['aria-labelledby']?.split(/\s+/) ?? [];
    expect(ariaLabelOnlyIds).toContain('search-label');
    expect(ariaLabelOnlyIds).toContain(ariaLabelOnlySearchField.inputProps.value.id);

    let requiredSearchField = useAriaSearchField({
      inputValue: ref(''),
      isRequired: true
    });
    expect(requiredSearchField.isInvalid.value).toBe(true);

    searchInput.remove();
  });

  it('computes vue-aria select trigger, menu selection, and hidden select wiring', () => {
    let selectionChanges: Array<string | number | null> = [];
    let selectedKey = ref<string | null>(null);
    let options = [
      {key: 'react', textValue: 'React'},
      {key: 'vue', textValue: 'Vue'}
    ];
    let select = useAriaSelect({
      label: 'Framework',
      onSelectionChange: (key) => {
        selectionChanges.push(key);
      },
      options,
      selectedKey
    });

    expect(select.triggerProps.value['aria-haspopup']).toBe('listbox');
    select.triggerProps.value.onClick();
    expect(select.isOpen.value).toBe(true);

    select.menuProps.value.onSelect('vue');
    expect(selectedKey.value).toBe('vue');
    expect(select.isOpen.value).toBe(false);
    expect(select.selectedItem.value?.textValue).toBe('Vue');
    expect(selectionChanges).toEqual(['vue']);

    select.triggerProps.value.onKeyDown(new KeyboardEvent('keydown', {key: 'ArrowUp'}));
    expect(select.isOpen.value).toBe(true);
    expect(selectedKey.value).toBe('vue');
    select.close();

    select.triggerProps.value.onKeyDown(new KeyboardEvent('keydown', {key: 'ArrowLeft'}));
    expect(selectedKey.value).toBe('react');
    select.triggerProps.value.onKeyDown(new KeyboardEvent('keydown', {key: 'ArrowRight'}));
    expect(selectedKey.value).toBe('vue');
    expect(selectionChanges).toEqual(['vue', 'react', 'vue']);

    select.open();
    select.menuProps.value.onSelect('vue');
    expect(selectionChanges).toEqual(['vue', 'react', 'vue']);

    let hiddenSelect = useAriaHiddenSelect({
      name: 'framework',
      options: ref(options),
      selectedKey
    });
    expect(hiddenSelect.selectProps.value.name).toBe('framework');
    expect(hiddenSelect.selectProps.value.value).toBe('vue');
    hiddenSelect.selectProps.value.onChange('react');
    expect(selectedKey.value).toBe('react');

    let composedLabelSelect = useAriaSelect({
      'aria-label': 'Framework picker',
      'aria-labelledby': 'framework-label',
      id: 'framework-trigger',
      label: 'Framework',
      options,
      selectedKey: ref<string | null>('react')
    });
    let composedTriggerLabelledBy = composedLabelSelect.triggerProps.value['aria-labelledby']?.split(/\s+/) ?? [];
    let composedMenuLabelledBy = composedLabelSelect.menuProps.value['aria-labelledby']?.split(/\s+/) ?? [];
    expect(composedLabelSelect.triggerProps.value['aria-label']).toBe('Framework picker');
    expect(composedTriggerLabelledBy).toContain(composedLabelSelect.valueProps.value.id);
    expect(composedTriggerLabelledBy).toContain(composedLabelSelect.labelProps.value.id as string);
    expect(composedTriggerLabelledBy).toContain('framework-label');
    expect(composedTriggerLabelledBy).toContain('framework-trigger');
    expect(composedMenuLabelledBy).toContain(composedLabelSelect.labelProps.value.id as string);
    expect(composedMenuLabelledBy).toContain('framework-label');
    expect(composedMenuLabelledBy).toContain('framework-trigger');

    let ariaLabelOnlySelect = useAriaSelect({
      'aria-label': 'Framework picker',
      id: 'framework-trigger-no-label',
      options,
      selectedKey: ref<string | null>('react')
    });
    let ariaLabelOnlyTriggerLabelledBy = ariaLabelOnlySelect.triggerProps.value['aria-labelledby']?.split(/\s+/) ?? [];
    expect(ariaLabelOnlyTriggerLabelledBy).toContain(ariaLabelOnlySelect.valueProps.value.id);
    expect(ariaLabelOnlyTriggerLabelledBy).toContain('framework-trigger-no-label');
    expect(ariaLabelOnlySelect.menuProps.value['aria-labelledby']).toBe('framework-trigger-no-label');
  });

  it('computes vue-aria selection delegate, list, and typeahead behavior', () => {
    let items = [
      {key: 'react', textValue: 'React'},
      {key: 'vue', textValue: 'Vue'},
      {disabled: true, key: 'svelte', textValue: 'Svelte'}
    ];

    let keyboardDelegate = new VueListKeyboardDelegate(items);
    expect(keyboardDelegate.getFirstKey()).toBe('react');
    expect(keyboardDelegate.getLastKey()).toBe('vue');
    expect(keyboardDelegate.getKeyBelow('react')).toBe('vue');
    expect(keyboardDelegate.getKeyForSearch('v')).toBe('vue');

    let selectableList = useAriaSelectableList({
      selectionMode: 'single'
    });
    let selectionEvents: Array<Set<string | number>> = [];
    let selectableCollection = useAriaSelectableCollection({
      keyboardDelegate,
      onSelectionChange: (keys) => {
        selectionEvents.push(new Set(keys));
      },
      selectionManager: selectableList.selectionManager
    });

    selectableCollection.collectionProps.value.onKeyDown(new KeyboardEvent('keydown', {key: 'ArrowDown'}));
    expect(selectableList.selectionManager.focusedKey.value).toBe('react');
    expect(Array.from(selectableList.selectionManager.selectedKeys.value)).toEqual(['react']);

    selectableCollection.collectionProps.value.onKeyDown(new KeyboardEvent('keydown', {key: 'ArrowDown'}));
    expect(selectableList.selectionManager.focusedKey.value).toBe('vue');
    expect(Array.from(selectableList.selectionManager.selectedKeys.value)).toEqual(['vue']);
    expect(selectionEvents.length).toBe(2);

    let selectableItem = useAriaSelectableItem({
      key: 'vue'
    }, selectableList.selectionManager);
    expect(selectableItem.itemProps.value['aria-selected']).toBe(true);

    let typeSelectEvents: Array<string | number> = [];
    let typeSelect = useAriaTypeSelect({
      keyboardDelegate,
      onTypeSelect: (key) => {
        typeSelectEvents.push(key);
      },
      selectionManager: selectableList.selectionManager
    });
    typeSelect.typeSelectProps.value.onKeyDownCapture(new KeyboardEvent('keydown', {key: 'r'}));
    expect(selectableList.selectionManager.focusedKey.value).toBe('react');
    expect(typeSelectEvents).toEqual(['react']);
  });

  it('supports vue-stately selection manager values in vue-aria selection hooks', () => {
    let nodes: StatelyListNode<{label: string}>[] = [
      {key: 'item-1', textValue: 'First', type: 'item', value: {label: 'First'}},
      {key: 'item-2', textValue: 'Second', type: 'item', value: {label: 'Second'}},
      {key: 'item-3', textValue: 'Third', type: 'item', value: {label: 'Third'}}
    ];

    let state = useStatelyMultipleSelectionState({
      selectionMode: 'single'
    });
    let manager = new StatelySelectionManager(new StatelyListCollection(nodes), state);
    let keyboardDelegate = new VueListKeyboardDelegate(nodes.map((node) => ({
      key: node.key,
      textValue: node.textValue ?? String(node.key)
    })));

    let selectableCollection = useAriaSelectableCollection({
      keyboardDelegate,
      selectionManager: manager
    });

    selectableCollection.collectionProps.value.onKeyDown(new KeyboardEvent('keydown', {key: 'ArrowUp'}));
    expect(manager.focusedKey).toBe('item-3');
    expect(Array.from(manager.selectedKeys)).toEqual(['item-3']);

    selectableCollection.collectionProps.value.onKeyDown(new KeyboardEvent('keydown', {key: 'ArrowDown'}));
    expect(manager.focusedKey).toBe('item-1');
    expect(Array.from(manager.selectedKeys)).toEqual(['item-1']);

    let selectableItem = useAriaSelectableItem({
      key: 'item-1'
    }, manager);
    expect(selectableItem.states.value.isFocused).toBe(true);
    expect(selectableItem.itemProps.value['aria-selected']).toBe(true);

    let typeSelect = useAriaTypeSelect({
      keyboardDelegate,
      selectionManager: manager
    });
    typeSelect.typeSelectProps.value.onKeyDownCapture(new KeyboardEvent('keydown', {key: 't'}));
    expect(manager.focusedKey).toBe('item-3');
  });

  it('supports selectable-list disallow-empty and replace behaviors', () => {
    let singleSelectedKeys = ref(new Set<string>(['react']));
    let singleList = useAriaSelectableList({
      disallowEmptySelection: true,
      selectedKeys: singleSelectedKeys,
      selectionMode: 'single'
    });

    singleList.selectionManager.select('react');
    expect(Array.from(singleSelectedKeys.value)).toEqual(['react']);

    singleList.selectionManager.select('vue');
    expect(Array.from(singleSelectedKeys.value)).toEqual(['vue']);

    let singleToggleList = useAriaSelectableList({
      selectedKeys: singleSelectedKeys,
      selectionMode: 'single'
    });
    singleToggleList.selectionManager.select('vue');
    expect(Array.from(singleSelectedKeys.value)).toEqual([]);

    let replaceSelectedKeys = ref(new Set<string>(['react', 'svelte']));
    let replaceList = useAriaSelectableList({
      selectedKeys: replaceSelectedKeys,
      selectionBehavior: 'replace',
      selectionMode: 'multiple'
    });
    replaceList.selectionManager.select('vue');
    expect(Array.from(replaceSelectedKeys.value)).toEqual(['vue']);

    let disallowEmptyKeys = ref(new Set<string>(['vue']));
    let disallowEmptyMultiList = useAriaSelectableList({
      disallowEmptySelection: true,
      selectedKeys: disallowEmptyKeys,
      selectionMode: 'multiple'
    });
    disallowEmptyMultiList.selectionManager.select('vue');
    expect(Array.from(disallowEmptyKeys.value)).toEqual(['vue']);
  });

  it('computes vue-aria separator role and orientation semantics', () => {
    let verticalSeparator = useAriaSeparator({
      orientation: 'vertical'
    });
    expect(verticalSeparator.separatorProps.value.role).toBe('separator');
    expect(verticalSeparator.separatorProps.value['aria-orientation']).toBe('vertical');

    let hrSeparator = useAriaSeparator({
      elementType: 'hr'
    });
    expect(hrSeparator.separatorProps.value.role).toBeUndefined();
  });

  it('computes vue-aria slider track and thumb interactions', () => {
    let values = ref([20, 80]);
    let focusedThumb = ref<number | undefined>(undefined);
    let draggingThumbs = ref(new Set<number>());
    let editableThumbs = ref(new Set([0, 1]));

    let setThumbValue = (index: number, value: number) => {
      values.value[index] = Math.min(Math.max(Math.round(value), 0), 100);
    };

    let state = {
      values,
      focusedThumb,
      pageSize: ref(10),
      step: ref(1),
      getPercentValue: (percent: number) => Math.round(percent * 100),
      getThumbMaxValue: () => 100,
      getThumbMinValue: () => 0,
      getThumbPercent: (index: number) => (values.value[index] ?? 0) / 100,
      getThumbValueLabel: (index: number) => `${values.value[index] ?? 0}`,
      incrementThumb: (index: number, amount: number) => {
        setThumbValue(index, (values.value[index] ?? 0) + amount);
      },
      decrementThumb: (index: number, amount: number) => {
        setThumbValue(index, (values.value[index] ?? 0) - amount);
      },
      isThumbDragging: (index: number) => draggingThumbs.value.has(index),
      isThumbEditable: (index: number) => editableThumbs.value.has(index),
      setFocusedThumb: (index: number | undefined) => {
        focusedThumb.value = index;
      },
      setThumbDragging: (index: number, isDragging: boolean) => {
        let nextDraggingThumbs = new Set(draggingThumbs.value);
        if (isDragging) {
          nextDraggingThumbs.add(index);
        } else {
          nextDraggingThumbs.delete(index);
        }
        draggingThumbs.value = nextDraggingThumbs;
      },
      setThumbEditable: (index: number, isEditable: boolean) => {
        let nextEditableThumbs = new Set(editableThumbs.value);
        if (isEditable) {
          nextEditableThumbs.add(index);
        } else {
          nextEditableThumbs.delete(index);
        }
        editableThumbs.value = nextEditableThumbs;
      },
      setThumbPercent: (index: number, percent: number) => {
        setThumbValue(index, percent * 100);
      },
      setThumbValue
    };

    let trackElement = document.createElement('div');
    trackElement.getBoundingClientRect = () => createDOMRect(0, 0, 200, 24);
    let trackRef = ref<Element | null>(trackElement);

    let slider = useAriaSlider({
      label: 'Volume'
    }, state, trackRef);
    let firstInput = document.createElement('input');
    let secondInput = document.createElement('input');
    document.body.append(firstInput, secondInput);

    let thumb = useAriaSliderThumb({
      index: 0,
      inputRef: ref<HTMLInputElement | null>(firstInput),
      trackRef
    }, state);
    let secondThumb = useAriaSliderThumb({
      index: 1,
      inputRef: ref<HTMLInputElement | null>(secondInput),
      trackRef
    }, state);

    expect(slider.groupProps.value.role).toBe('group');
    expect(slider.groupProps.value['aria-labelledby']).toContain('label');
    expect(slider.outputProps.value.htmlFor.split(' ')).toHaveLength(2);
    expect(document.activeElement).not.toBe(secondInput);

    slider.trackProps.value.onMouseDown(new MouseEvent('mousedown', {
      bubbles: true,
      button: 0,
      clientX: 160,
      clientY: 12
    }));
    expect(focusedThumb.value).toBe(1);
    expect(secondThumb.isFocused.value).toBe(true);
    expect(document.activeElement).toBe(secondInput);
    expect(values.value[1]).toBe(80);

    window.dispatchEvent(new MouseEvent('mousemove', {
      clientX: 120,
      clientY: 12
    }));
    expect(values.value[1]).toBe(60);

    window.dispatchEvent(new MouseEvent('mouseup', {
      clientX: 120,
      clientY: 12
    }));
    expect(draggingThumbs.value.has(1)).toBe(false);

    expect(thumb.inputProps.value.type).toBe('range');
    expect(thumb.thumbProps.value.style.left).toBe('20%');

    thumb.inputProps.value.onChange('42');
    expect(values.value[0]).toBe(42);

    thumb.inputProps.value.onKeyDown(new KeyboardEvent('keydown', {key: 'End'}));
    expect(values.value[0]).toBe(100);

    thumb.thumbProps.value.onMouseDown(new MouseEvent('mousedown', {
      bubbles: true,
      button: 0,
      clientX: 40,
      clientY: 12
    }));
    window.dispatchEvent(new MouseEvent('mousemove', {
      clientX: 10,
      clientY: 12
    }));
    window.dispatchEvent(new MouseEvent('mouseup', {
      clientX: 10,
      clientY: 12
    }));
    expect(values.value[0]).toBe(5);

    firstInput.remove();
    secondInput.remove();
  });

  it('composes vue-aria slider and thumb labelledby ownership parity', () => {
    let values = ref([25]);
    let focusedThumb = ref<number | undefined>(undefined);
    let draggingThumbs = ref(new Set<number>());
    let editableThumbs = ref(new Set([0]));

    let setThumbValue = (index: number, value: number) => {
      values.value[index] = Math.min(Math.max(Math.round(value), 0), 100);
    };

    let state = {
      values,
      focusedThumb,
      pageSize: ref(10),
      step: ref(1),
      getPercentValue: (percent: number) => Math.round(percent * 100),
      getThumbMaxValue: () => 100,
      getThumbMinValue: () => 0,
      getThumbPercent: (index: number) => (values.value[index] ?? 0) / 100,
      getThumbValueLabel: (index: number) => `${values.value[index] ?? 0}`,
      incrementThumb: (index: number, amount: number) => {
        setThumbValue(index, (values.value[index] ?? 0) + amount);
      },
      decrementThumb: (index: number, amount: number) => {
        setThumbValue(index, (values.value[index] ?? 0) - amount);
      },
      isThumbDragging: (index: number) => draggingThumbs.value.has(index),
      isThumbEditable: (index: number) => editableThumbs.value.has(index),
      setFocusedThumb: (index: number | undefined) => {
        focusedThumb.value = index;
      },
      setThumbDragging: (index: number, isDragging: boolean) => {
        let nextDraggingThumbs = new Set(draggingThumbs.value);
        if (isDragging) {
          nextDraggingThumbs.add(index);
        } else {
          nextDraggingThumbs.delete(index);
        }
        draggingThumbs.value = nextDraggingThumbs;
      },
      setThumbEditable: (index: number, isEditable: boolean) => {
        let nextEditableThumbs = new Set(editableThumbs.value);
        if (isEditable) {
          nextEditableThumbs.add(index);
        } else {
          nextEditableThumbs.delete(index);
        }
        editableThumbs.value = nextEditableThumbs;
      },
      setThumbPercent: (index: number, percent: number) => {
        setThumbValue(index, percent * 100);
      },
      setThumbValue
    };

    let trackElement = document.createElement('div');
    trackElement.getBoundingClientRect = () => createDOMRect(0, 0, 200, 24);
    let trackRef = ref<Element | null>(trackElement);

    let slider = useAriaSlider({
      'aria-label': 'Effort custom',
      'aria-labelledby': 'external-effort-label',
      id: 'effort-slider',
      label: 'Effort'
    }, state, trackRef);

    let sliderLabelledByIds = slider.groupProps.value['aria-labelledby']?.split(/\s+/) ?? [];
    expect(sliderLabelledByIds).toContain('effort-slider-label');
    expect(sliderLabelledByIds).toContain('external-effort-label');
    expect(sliderLabelledByIds).toContain('effort-slider');
    expect(slider.groupProps.value['aria-label']).toBe('Effort custom');

    let thumb = useAriaSliderThumb({
      'aria-label': 'Minimum effort',
      'aria-labelledby': 'external-thumb-label',
      index: 0,
      inputRef: ref<HTMLInputElement | null>(document.createElement('input')),
      trackRef
    }, state);

    let thumbLabelledByIds = thumb.inputProps.value['aria-labelledby']?.split(/\s+/) ?? [];
    expect(thumbLabelledByIds).toContain('effort-slider-label');
    expect(thumbLabelledByIds).toContain('external-thumb-label');
    expect(thumbLabelledByIds).toContain(thumb.inputProps.value.id);
    expect(thumb.inputProps.value['aria-label']).toBe('Minimum effort');
  });

  it('computes vue-aria spinbutton keyboard and press interactions', () => {
    vi.useFakeTimers();

    try {
      let value = ref(2);
      let minValue = 0;
      let maxValue = 5;
      let incrementCount = 0;
      let decrementCount = 0;

      let spinButton = useAriaSpinButton({
        maxValue,
        minValue,
        textValue: ref('2 items'),
        value,
        onDecrement: () => {
          decrementCount += 1;
          value.value = Math.max(minValue, value.value - 1);
        },
        onDecrementPage: () => {
          value.value = Math.max(minValue, value.value - 2);
        },
        onDecrementToMin: () => {
          value.value = minValue;
        },
        onIncrement: () => {
          incrementCount += 1;
          value.value = Math.min(maxValue, value.value + 1);
        },
        onIncrementPage: () => {
          value.value = Math.min(maxValue, value.value + 2);
        },
        onIncrementToMax: () => {
          value.value = maxValue;
        }
      });

      expect(spinButton.spinButtonProps.value.role).toBe('spinbutton');
      expect(spinButton.spinButtonProps.value['aria-valuenow']).toBe(2);
      expect(spinButton.spinButtonProps.value['aria-valuetext']).toBe('2 items');

      spinButton.spinButtonProps.value.onKeyDown(new KeyboardEvent('keydown', {key: 'ArrowUp'}));
      expect(value.value).toBe(3);
      spinButton.spinButtonProps.value.onKeyDown(new KeyboardEvent('keydown', {key: 'PageUp'}));
      expect(value.value).toBe(5);
      spinButton.spinButtonProps.value.onKeyDown(new KeyboardEvent('keydown', {key: 'ArrowDown'}));
      expect(value.value).toBe(4);
      spinButton.spinButtonProps.value.onKeyDown(new KeyboardEvent('keydown', {key: 'Home'}));
      expect(value.value).toBe(0);

      spinButton.incrementButtonProps.value.onPressStart({pointerType: 'mouse'});
      expect(value.value).toBe(1);
      vi.advanceTimersByTime(520);
      expect(value.value).toBe(4);
      spinButton.incrementButtonProps.value.onPressUp({pointerType: 'mouse'});
      spinButton.incrementButtonProps.value.onPressEnd({pointerType: 'mouse'});

      spinButton.decrementButtonProps.value.onPressStart({pointerType: 'touch'});
      spinButton.decrementButtonProps.value.onPressUp({pointerType: 'touch'});
      spinButton.decrementButtonProps.value.onPressEnd({pointerType: 'touch'});
      expect(value.value).toBe(3);

      spinButton.incrementButtonProps.value.onPressStart({pointerType: 'touch'});
      vi.advanceTimersByTime(620);
      spinButton.incrementButtonProps.value.onPressUp({pointerType: 'touch'});
      spinButton.incrementButtonProps.value.onPressEnd({pointerType: 'touch'});
      expect(value.value).toBe(4);

      value.value = 4;
      spinButton.incrementButtonProps.value.onPressStart({pointerType: 'touch'});
      window.dispatchEvent(new Event('pointercancel'));
      vi.advanceTimersByTime(620);
      spinButton.incrementButtonProps.value.onPressEnd({pointerType: 'touch'});
      expect(value.value).toBe(4);

      expect(incrementCount).toBeGreaterThan(0);
      expect(decrementCount).toBeGreaterThan(0);

      let negativeSpinButton = useAriaSpinButton({
        textValue: ref('-2 items'),
        value: ref(-2)
      });
      expect(negativeSpinButton.spinButtonProps.value['aria-valuetext']).toBe('−2 items');
    } finally {
      vi.useRealTimers();
    }
  });

  it('computes vue-aria ssr provider scopes and safe ids', () => {
    let rootProvider = AriaSSRProvider();
    let firstId = useAriaSSRSafeId();
    let secondId = useAriaSSRSafeId();

    expect(firstId).toBe('react-aria-1');
    expect(secondId).toBe('react-aria-2');

    let nestedProvider = AriaSSRProvider();
    let nestedId = useAriaSSRSafeId();
    nestedProvider.dispose();

    let afterNestedId = useAriaSSRSafeId();
    expect(nestedId).toBe('react-aria-3-1');
    expect(afterNestedId).toBe('react-aria-4');
    expect(useAriaSSRSafeId('custom-id')).toBe('custom-id');
    expect(useAriaIsSSR()).toBe(false);

    rootProvider.dispose();

    let warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    let originalCreateElement = window.document.createElement;
    try {
      (window.document as Document & {createElement?: Document['createElement']}).createElement = undefined as unknown as Document['createElement'];
      useAriaSSRSafeId();
      expect(warn).toHaveBeenCalledWith('When server rendering, you must wrap your application in an <SSRProvider> to ensure consistent ids are generated between the client and server.');
    } finally {
      (window.document as Document & {createElement?: Document['createElement']}).createElement = originalCreateElement;
      warn.mockRestore();
    }
  });

  it('computes vue-aria steplist list and step item semantics', () => {
    let selectedKeys = ref<Set<string | number>>(new Set(['setup']));
    let selectableList = useAriaSelectableList({
      selectedKeys,
      selectionMode: 'single'
    });
    let selectedKey = computed(() => Array.from(selectedKeys.value)[0] ?? null);

    let stepListState = {
      selectedKey,
      selectionManager: selectableList.selectionManager,
      isSelectable: (key: string | number) => key !== 'review'
    };

    let stepList = useAriaStepList(stepListState);
    expect(stepList.listProps.value.role).toBe('list');
    expect(stepList.listProps.value['aria-label']).toBe('Step list');

    let labelledbyStepList = useAriaStepList(stepListState, {
      'aria-labelledby': 'external-step-list-label'
    });
    expect(labelledbyStepList.listProps.value['aria-label']).toBe('Step list');
    expect(labelledbyStepList.listProps.value['aria-labelledby']).toBe('external-step-list-label');

    let explicitAndLabelledbyStepList = useAriaStepList(stepListState, {
      'aria-label': 'Release steps',
      'aria-labelledby': 'external-step-list-label'
    });
    expect(explicitAndLabelledbyStepList.listProps.value['aria-label']).toBe('Release steps');
    expect(explicitAndLabelledbyStepList.listProps.value['aria-labelledby']).toBe('external-step-list-label');

    let setupItem = useAriaStepListItem({key: 'setup'}, stepListState);
    expect(setupItem.stepProps.value['aria-current']).toBe('step');

    let detailsItem = useAriaStepListItem({key: 'details'}, stepListState);
    expect(detailsItem.stepProps.value['aria-current']).toBeUndefined();
    detailsItem.stepProps.value.onClick();
    expect(Array.from(selectedKeys.value)).toEqual(['details']);
    expect(detailsItem.stepProps.value['aria-current']).toBe('step');

    let preventDefault = vi.fn();
    let stopPropagation = vi.fn();
    detailsItem.stepProps.value.onKeyDown({
      key: 'ArrowDown',
      preventDefault,
      stopPropagation
    } as unknown as KeyboardEvent);
    expect(preventDefault).toHaveBeenCalledTimes(1);
    expect(stopPropagation).toHaveBeenCalledTimes(1);

    let reviewItem = useAriaStepListItem({key: 'review'}, stepListState);
    expect(reviewItem.stepProps.value['aria-disabled']).toBe(true);
    expect(reviewItem.stepProps.value.tabIndex).toBeUndefined();
    reviewItem.stepProps.value.onClick();
    expect(Array.from(selectedKeys.value)).toEqual(['details']);
  });

  it('computes vue-aria switch role and toggle behavior', () => {
    let selected = ref(false);
    let switchControl = useAriaSwitch({
      ariaLabel: 'Wi-Fi',
      isSelected: selected
    });

    expect(switchControl.inputProps.value.role).toBe('switch');
    expect(switchControl.inputProps.value.checked).toBe(false);
    expect(switchControl.inputProps.value['aria-label']).toBe('Wi-Fi');

    switchControl.press();
    expect(selected.value).toBe(true);
    expect(switchControl.inputProps.value['aria-checked']).toBe(true);

    switchControl.pressStart();
    expect(switchControl.isPressed.value).toBe(true);
    switchControl.pressEnd();
    expect(switchControl.isPressed.value).toBe(false);

    let readOnlySelected = ref(true);
    let readOnlySwitch = useAriaSwitch({
      isReadOnly: true,
      isSelected: readOnlySelected
    });
    readOnlySwitch.press();
    expect(readOnlySelected.value).toBe(true);
  });

  it('computes vue-aria toggle press behavior and accessibility props', () => {
    let selected = ref(false);
    let pressChanges: boolean[] = [];
    let changeEvents: boolean[] = [];
    let pressCount = 0;

    let toggle = useAriaToggle({
      'aria-label': 'Email notifications',
      isSelected: selected,
      onChange: (isSelected) => {
        changeEvents.push(isSelected);
      },
      onPress: () => {
        pressCount += 1;
      },
      onPressChange: (isPressed) => {
        pressChanges.push(isPressed);
      }
    });

    expect(toggle.inputProps.value.type).toBe('checkbox');
    expect(toggle.inputProps.value.checked).toBe(false);
    expect(toggle.isInvalid.value).toBe(false);

    toggle.press();
    expect(selected.value).toBe(true);
    expect(changeEvents).toEqual([true]);
    expect(pressChanges).toEqual([true, false]);
    expect(pressCount).toBe(1);

    toggle.inputProps.value.onChange(true);
    expect(selected.value).toBe(true);
    expect(changeEvents).toEqual([true]);

    toggle.inputProps.value.onChange(false);
    expect(selected.value).toBe(false);
    expect(changeEvents).toEqual([true, false]);

    toggle.inputProps.value.onKeyDown(new KeyboardEvent('keydown', {key: 'Enter'}));
    expect(selected.value).toBe(true);

    let preventDefault = vi.fn();
    toggle.labelProps.value.onClick({
      preventDefault
    } as unknown as MouseEvent);
    expect(preventDefault).toHaveBeenCalledTimes(1);
    expect(selected.value).toBe(false);

    let readOnlySelected = ref(true);
    let readOnlyToggle = useAriaToggle({
      'aria-label': 'Read only toggle',
      isReadOnly: true,
      isSelected: readOnlySelected
    });
    readOnlyToggle.press();
    expect(readOnlySelected.value).toBe(true);

    let invalidToggle = useAriaToggle({
      'aria-label': 'Invalid toggle',
      validationState: 'invalid'
    });
    expect(invalidToggle.inputProps.value['aria-invalid']).toBe(true);
  });

  it('warns when vue-aria toggle is missing visible children and aria label', () => {
    let warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    useAriaToggle();

    expect(warnSpy).toHaveBeenCalledWith('If you do not provide children, you must specify an aria-label for accessibility');
    warnSpy.mockRestore();
  });

  it('computes vue-aria toolbar roles and keyboard focus navigation', () => {
    let toolbarElement = document.createElement('div');
    let firstButton = document.createElement('button');
    firstButton.textContent = 'First';
    let secondButton = document.createElement('button');
    secondButton.textContent = 'Second';
    let thirdButton = document.createElement('button');
    thirdButton.textContent = 'Third';
    toolbarElement.append(firstButton, secondButton, thirdButton);
    document.body.append(toolbarElement);

    let verticalToolbarElement = document.createElement('div');
    let topButton = document.createElement('button');
    topButton.textContent = 'Top';
    let bottomButton = document.createElement('button');
    bottomButton.textContent = 'Bottom';
    verticalToolbarElement.append(topButton, bottomButton);
    document.body.append(verticalToolbarElement);

    let outerToolbar = document.createElement('div');
    outerToolbar.setAttribute('role', 'toolbar');
    let nestedToolbarElement = document.createElement('div');
    outerToolbar.append(nestedToolbarElement);
    document.body.append(outerToolbar);

    try {
      let toolbar = useAriaToolbar({
        ariaLabel: 'Formatting controls'
      }, ref<HTMLElement | null>(toolbarElement));
      let toolbarKeyDown = toolbar.toolbarProps.value.onKeyDownCapture;

      expect(toolbar.isInToolbar.value).toBe(false);
      expect(toolbar.toolbarProps.value.role).toBe('toolbar');
      expect(toolbar.toolbarProps.value['aria-orientation']).toBe('horizontal');
      expect(toolbar.toolbarProps.value['aria-label']).toBe('Formatting controls');

      if (!toolbarKeyDown) {
        throw new Error('Expected toolbar keydown handler');
      }

      toolbarElement.addEventListener('keydown', toolbarKeyDown as EventListener, true);

      firstButton.focus();
      firstButton.dispatchEvent(new KeyboardEvent('keydown', {bubbles: true, cancelable: true, key: 'ArrowRight'}));
      expect(document.activeElement).toBe(secondButton);

      secondButton.dispatchEvent(new KeyboardEvent('keydown', {bubbles: true, cancelable: true, key: 'ArrowLeft'}));
      expect(document.activeElement).toBe(firstButton);

      secondButton.focus();
      secondButton.dispatchEvent(new KeyboardEvent('keydown', {bubbles: true, cancelable: true, key: 'Tab'}));
      expect(document.activeElement).toBe(thirdButton);

      thirdButton.dispatchEvent(new KeyboardEvent('keydown', {bubbles: true, cancelable: true, key: 'Tab', shiftKey: true}));
      expect(document.activeElement).toBe(firstButton);

      let verticalToolbar = useAriaToolbar({
        ariaLabel: 'Vertical controls',
        orientation: 'vertical'
      }, ref<HTMLElement | null>(verticalToolbarElement));
      let verticalKeyDown = verticalToolbar.toolbarProps.value.onKeyDownCapture;

      if (!verticalKeyDown) {
        throw new Error('Expected vertical toolbar keydown handler');
      }

      verticalToolbarElement.addEventListener('keydown', verticalKeyDown as EventListener, true);
      topButton.focus();
      topButton.dispatchEvent(new KeyboardEvent('keydown', {bubbles: true, cancelable: true, key: 'ArrowDown'}));
      expect(document.activeElement).toBe(bottomButton);

      let nestedToolbar = useAriaToolbar({
        ariaLabel: 'Nested controls'
      }, ref<HTMLElement | null>(nestedToolbarElement));
      expect(nestedToolbar.isInToolbar.value).toBe(true);
      expect(nestedToolbar.toolbarProps.value.role).toBe('group');
      expect(nestedToolbar.toolbarProps.value.onKeyDownCapture).toBeUndefined();
    } finally {
      document.body.removeChild(toolbarElement);
      document.body.removeChild(verticalToolbarElement);
      document.body.removeChild(outerToolbar);
    }
  });

  it('computes vue-aria tooltip trigger and tooltip hover/focus linkage', () => {
    let triggerElement = document.createElement('button');
    triggerElement.textContent = 'Details';
    document.body.append(triggerElement);

    let tooltipElement = document.createElement('div');
    document.body.append(tooltipElement);

    try {
      let trigger = useAriaTooltipTrigger({
        trigger: 'focus hover',
        triggerRef: ref<HTMLElement | null>(triggerElement)
      });
      let tooltip = useAriaTooltip({
        id: computed(() => trigger.tooltipProps.value.id)
      }, trigger);

      let triggerProps = trigger.triggerProps.value;
      if (triggerProps.onFocus) {
        triggerElement.addEventListener('focus', triggerProps.onFocus as EventListener);
      }
      if (triggerProps.onBlur) {
        triggerElement.addEventListener('blur', triggerProps.onBlur as EventListener);
      }
      if (triggerProps.onKeyDown) {
        triggerElement.addEventListener('keydown', triggerProps.onKeyDown as EventListener);
      }
      if (triggerProps.onKeyUp) {
        triggerElement.addEventListener('keyup', triggerProps.onKeyUp as EventListener);
      }
      if (triggerProps.onPointerEnter) {
        triggerElement.addEventListener('pointerenter', triggerProps.onPointerEnter as EventListener);
      }
      if (triggerProps.onPointerLeave) {
        triggerElement.addEventListener('pointerleave', triggerProps.onPointerLeave as EventListener);
      }
      triggerElement.addEventListener('pointerdown', triggerProps.onPointerDown as EventListener);

      let tooltipProps = tooltip.tooltipProps.value;
      if (tooltipProps.onPointerEnter) {
        tooltipElement.addEventListener('pointerenter', tooltipProps.onPointerEnter as EventListener);
      }
      if (tooltipProps.onPointerLeave) {
        tooltipElement.addEventListener('pointerleave', tooltipProps.onPointerLeave as EventListener);
      }

      expect(tooltip.tooltipProps.value.role).toBe('tooltip');
      expect(trigger.tooltipProps.value.id).toContain('react-aria-');

      setInteractionModality('keyboard');
      triggerElement.focus();
      expect(trigger.isOpen.value).toBe(true);
      expect(trigger.triggerProps.value['aria-describedby']).toBe(trigger.tooltipProps.value.id);

      triggerElement.dispatchEvent(createPointerEvent('pointerdown', {button: 0, pointerId: 1, pointerType: 'mouse'}));
      expect(trigger.isOpen.value).toBe(false);

      setInteractionModality('pointer');
      triggerElement.dispatchEvent(createPointerEvent('pointerenter', {pointerType: 'mouse'}));
      expect(trigger.isOpen.value).toBe(true);
      triggerElement.dispatchEvent(createPointerEvent('pointerleave', {pointerType: 'mouse'}));
      expect(trigger.isOpen.value).toBe(false);

      trigger.open();
      expect(trigger.isOpen.value).toBe(true);
      tooltipElement.dispatchEvent(createPointerEvent('pointerenter', {pointerType: 'mouse'}));
      expect(trigger.isOpen.value).toBe(true);
      tooltipElement.dispatchEvent(createPointerEvent('pointerleave', {pointerType: 'mouse'}));
      expect(trigger.isOpen.value).toBe(false);

      let openChanges: boolean[] = [];
      let trackedTrigger = useAriaTooltipTrigger({
        onOpenChange: (nextOpen) => {
          openChanges.push(nextOpen);
        },
        triggerRef: ref<HTMLElement | null>(triggerElement)
      });
      trackedTrigger.open();
      trackedTrigger.open();
      trackedTrigger.close();
      trackedTrigger.close();
      expect(openChanges).toEqual([true, false]);
    } finally {
      document.body.removeChild(triggerElement);
      document.body.removeChild(tooltipElement);
    }
  });

  it('defaults vue-aria tooltip trigger to hover behavior when trigger is not specified', () => {
    let triggerElement = document.createElement('button');
    triggerElement.textContent = 'Details';
    document.body.append(triggerElement);

    try {
      let trigger = useAriaTooltipTrigger({
        triggerRef: ref<HTMLElement | null>(triggerElement)
      });
      let triggerProps = trigger.triggerProps.value;
      if (triggerProps.onPointerEnter) {
        triggerElement.addEventListener('pointerenter', triggerProps.onPointerEnter as EventListener);
      }
      if (triggerProps.onPointerLeave) {
        triggerElement.addEventListener('pointerleave', triggerProps.onPointerLeave as EventListener);
      }

      setInteractionModality('pointer');
      triggerElement.dispatchEvent(createPointerEvent('pointerenter', {pointerType: 'mouse'}));
      expect(trigger.isOpen.value).toBe(true);

      triggerElement.dispatchEvent(createPointerEvent('pointerleave', {pointerType: 'mouse'}));
      expect(trigger.isOpen.value).toBe(false);
    } finally {
      document.body.removeChild(triggerElement);
    }
  });

  it('computes vue-aria treegrid semantics and expandable tree item behavior', () => {
    let selectedKeys = ref(new Set<string>());
    let expandedKeys = ref(new Set<string>());
    let tree = useAriaTree({
      ariaLabel: 'Project files',
      collection: {
        items: [
          {
            key: 'src',
            index: 0,
            textValue: 'src',
            hasChildItems: true
          },
          {
            key: 'README.md',
            index: 1,
            textValue: 'README.md'
          }
        ]
      },
      selectedKeys,
      selectionMode: 'multiple'
    });

    expect(tree.gridProps.value.role).toBe('treegrid');
    expect(tree.gridProps.value['aria-multiselectable']).toBe('true');

    let srcTreeItem = useAriaTreeItem({
      tree,
      item: computed(() => tree.collection.value.items[0]),
      expandedKeys
    });
    expect(srcTreeItem.expandButtonProps.value['aria-label']).toBe('Expand');
    let expandLabelledByIds = srcTreeItem.expandButtonProps.value['aria-labelledby']?.split(/\s+/) ?? [];
    expect(expandLabelledByIds).toContain(srcTreeItem.rowProps.value.id);
    expect(expandLabelledByIds).toContain(srcTreeItem.expandButtonProps.value.id as string);
    expect(srcTreeItem.expandButtonProps.value.disabled).toBe(false);

    srcTreeItem.expandButtonProps.value.onPress();
    expect(expandedKeys.value.has('src')).toBe(true);
    expect(srcTreeItem.isExpanded.value).toBe(true);
    expect(srcTreeItem.expandButtonProps.value['aria-label']).toBe('Collapse');
    expect(srcTreeItem.expandButtonProps.value['data-expanded']).toBe(true);
    expect(srcTreeItem.rowProps.value.role).toBe('row');

    srcTreeItem.expandButtonProps.value.onPress();
    expect(expandedKeys.value.has('src')).toBe(false);

    let readmeTreeItem = useAriaTreeItem({
      tree,
      item: computed(() => tree.collection.value.items[1]),
      expandedKeys
    });
    expect(readmeTreeItem.expandButtonProps.value.disabled).toBe(true);
    readmeTreeItem.expandButtonProps.value.onPress();
    expect(expandedKeys.value.size).toBe(0);
  });

  it('applies vue-aria utility helpers for props, ids, labels, and focusable nodes', () => {
    let callbackCalls: string[] = [];
    let chained = ariaChain((value: string) => {
      callbackCalls.push(`first:${value}`);
    }, (value: string) => {
      callbackCalls.push(`second:${value}`);
    });
    chained('run');
    expect(callbackCalls).toEqual(['first:run', 'second:run']);

    let mergedProps = ariaMergeProps(
      {
        class: 'primary',
        id: 'trigger',
        onClick: () => {
          callbackCalls.push('click:first');
        }
      },
      {
        class: 'compact',
        id: 'tooltip',
        onClick: () => {
          callbackCalls.push('click:second');
        }
      }
    );
    expect(mergedProps.class).toBe('primary compact');
    expect(mergedProps.id).toBe('trigger tooltip');
    (mergedProps.onClick as () => void)();
    expect(callbackCalls).toContain('click:first');
    expect(callbackCalls).toContain('click:second');

    let filteredProps = ariaFilterDOMProps({
      id: 'field-id',
      role: 'textbox',
      'aria-label': 'Email',
      'data-testid': 'email-field',
      onClick: () => {
        callbackCalls.push('filtered-click');
      },
      randomProp: 'ignored'
    }, {
      labelable: true
    });
    expect(filteredProps.id).toBe('field-id');
    expect(filteredProps['aria-label']).toBe('Email');
    expect(filteredProps['data-testid']).toBe('email-field');
    expect(filteredProps['randomProp']).toBeUndefined();

    let container = document.createElement('div');
    let button = document.createElement('button');
    container.append(button);
    document.body.append(container);

    try {
      button.focus();
      expect(ariaNodeContains(container, button)).toBe(true);
      expect(ariaGetActiveElement(document)).toBe(button);
      expect(ariaIsFocusWithin(container)).toBe(true);
      expect(ariaIsFocusable(button)).toBe(true);
      expect(ariaIsTabbable(button)).toBe(true);

      let eventTarget: EventTarget | null = null;
      let onClick = (event: MouseEvent) => {
        eventTarget = ariaGetEventTarget(event);
      };
      button.addEventListener('click', onClick);
      button.dispatchEvent(new MouseEvent('click', {bubbles: true}));
      button.removeEventListener('click', onClick);
      expect(eventTarget).toBe(button);
    } finally {
      document.body.removeChild(container);
    }

    expect(ariaMergeIds('label-id', 'description-id')).toBe('label-id description-id');
    expect(useAriaId()).toContain('react-aria-');
    expect(useAriaSlotId()).toContain('react-aria-');

    let labels = useAriaLabels(
      {
        'aria-label': 'Expand row'
      },
      {
        'aria-labelledby': 'row-label'
      }
    );
    expect(labels['aria-label']).toBe('Expand row');
    expect(labels['aria-labelledby']?.split(/\s+/)).toContain('row-label');
    expect(labels['aria-labelledby']?.split(/\s+/)).toContain(labels.id);
  });

  it('computes vue-aria visually hidden props and focus reveal behavior', () => {
    expect(ARIA_VISUALLY_HIDDEN_STYLES.position).toBe('absolute');
    expect(ARIA_VISUALLY_HIDDEN_STYLES.clipPath).toBe('inset(50%)');

    let hiddenLink = useAriaVisuallyHidden({
      isFocusable: true,
      style: {
        color: 'red'
      }
    });

    let linkElement = document.createElement('a');
    linkElement.tabIndex = 0;
    let hiddenProps = hiddenLink.visuallyHiddenProps.value;
    if (hiddenProps.onFocusin) {
      linkElement.addEventListener('focusin', hiddenProps.onFocusin as EventListener);
    }
    if (hiddenProps.onFocusout) {
      linkElement.addEventListener('focusout', hiddenProps.onFocusout as EventListener);
    }
    document.body.append(linkElement);
    let outside = document.createElement('button');
    document.body.append(outside);

    try {
      expect(hiddenLink.visuallyHiddenProps.value.style?.position).toBe('absolute');
      expect(hiddenLink.visuallyHiddenProps.value.style?.color).toBe('red');

      linkElement.focus();
      linkElement.dispatchEvent(new FocusEvent('focusin', {bubbles: true}));
      expect(hiddenLink.isFocused.value).toBe(true);
      expect(hiddenLink.visuallyHiddenProps.value.style).toEqual({color: 'red'});

      outside.focus();
      linkElement.dispatchEvent(new FocusEvent('focusout', {bubbles: true, relatedTarget: outside}));
      expect(hiddenLink.isFocused.value).toBe(false);
      expect(hiddenLink.visuallyHiddenProps.value.style?.position).toBe('absolute');
    } finally {
      document.body.removeChild(linkElement);
      document.body.removeChild(outside);
    }

    let nonFocusableHidden = useAriaVisuallyHidden();
    expect(nonFocusableHidden.visuallyHiddenProps.value.onFocusin).toBeUndefined();
    expect(nonFocusableHidden.visuallyHiddenProps.value.onFocusout).toBeUndefined();
  });

  it('exposes vue-spectrum s2 aggregate component entrypoints', () => {
    expect(typeof Spectrum2Plugin.install).toBe('function');
    expect(S2Provider).toBeDefined();
    expect(S2Button).toBeDefined();
    expect(S2TextField).toBeDefined();
    expect(S2TreeView).toBeDefined();
  });

  it('exposes vue-spectrum story utilities for powerset generation and error boundaries', async () => {
    let combinations = generateStoryPowerset([
      {size: ['m', 'l']},
      {isDisabled: [true, false]}
    ], (merged) => merged.size === 'm' && merged.isDisabled === true);

    expect(combinations).toContainEqual({});
    expect(combinations).toContainEqual({size: 'l'});
    expect(combinations).toContainEqual({isDisabled: false});
    expect(combinations).not.toContainEqual({size: 'm', isDisabled: true});

    let BrokenStory = defineComponent({
      name: 'BrokenStory',
      setup() {
        return () => {
          throw new Error('story failed');
        };
      }
    });
    let wrapper = mount(StoryUtilsErrorBoundary, {
      props: {
        message: 'Story fallback'
      },
      slots: {
        default: () => h(BrokenStory)
      }
    });

    await nextTick();
    expect(wrapper.text()).toContain('Story fallback');
  });

  it('exposes vue-spectrum style-macro-s1 runtime helpers', () => {
    let buttonStyles = s1Style({
      backgroundColor: {
        default: 'gray-500',
        isPressed: 'gray-600'
      },
      size: {
        default: 'm',
        density: {
          compact: 's'
        }
      }
    });

    expect(buttonStyles({})).toContain('s1-backgroundcolor-gray-500');
    expect(buttonStyles({isPressed: true})).toContain('s1-backgroundcolor-gray-600');
    expect(buttonStyles({density: 'compact'})).toContain('s1-size-s');
    expect(s1Raw('var(--accent-color)')).toBe('[var(--accent-color)]');
    expect(s1Keyframes({from: {opacity: 0}, to: {opacity: 1}})).toContain('s1-keyframes-');

    let scaledColor = baseS1Color('blue-500');
    expect(scaledColor.default).toBe('blue-500');
    expect(scaledColor.isHovered).toBe('blue-600');
    expect(s1LightDark('gray-100', 'gray-900')).toBe('[light-dark(gray-100, gray-900)]');
    expect(s1FocusRing({isFocusVisible: true})).toContain('s1-outlinecolor-highlight');
  });

  it('exposes vue-spectrum dark theme token sections', () => {
    expect(darkTheme.global.className).toBe('spectrum');
    expect(darkTheme.light.colorScheme).toBe('dark');
    expect(darkTheme.dark.className).toBe('spectrum--darkest');
    expect(darkTheme.medium.scale).toBe('medium');
    expect(darkTheme.large.scale).toBe('large');
  });

  it('exposes vue-spectrum default theme token sections', () => {
    expect(defaultTheme.global.className).toBe('spectrum');
    expect(defaultTheme.light.colorScheme).toBe('light');
    expect(defaultTheme.dark.className).toBe('spectrum--darkest');
    expect(defaultTheme.medium.scale).toBe('medium');
    expect(defaultTheme.large.scale).toBe('large');
  });

  it('exposes vue-spectrum express theme token sections', () => {
    expect(expressTheme.global.express).toBe('express');
    expect(expressTheme.medium.express).toBe('medium');
    expect(expressTheme.large.express).toBe('large');
    expect(expressTheme.light.colorScheme).toBe('light');
  });

  it('exposes vue-spectrum light theme token sections', () => {
    expect(lightTheme.global.className).toBe('spectrum');
    expect(lightTheme.light.className).toBe('spectrum--lightest');
    expect(lightTheme.light.colorScheme).toBe('light');
    expect(lightTheme.dark.className).toBe('spectrum--darkest');
    expect(lightTheme.medium.scale).toBe('medium');
    expect(lightTheme.large.scale).toBe('large');
  });

  it('computes vue-aria tag group and tag remove behavior', () => {
    let selectedKeys = ref(new Set<string>(['react']));
    let removedKeys: string[][] = [];
    let tagGroup = useAriaTagGroup({
      ariaLabel: 'Framework tags',
      description: 'Use delete to remove tags',
      errorMessage: 'At least one tag is required',
      isInvalid: true,
      items: [
        {key: 'react', textValue: 'React'},
        {key: 'vue', textValue: 'Vue'},
        {key: 'svelte', textValue: 'Svelte', isDisabled: true}
      ],
      onRemove: (keys) => {
        removedKeys.push(Array.from(keys).sort());
      },
      selectedKeys,
      selectionMode: 'multiple'
    });

    expect(tagGroup.gridProps.value.role).toBe('grid');
    expect(tagGroup.gridProps.value['aria-live']).toBe('off');
    expect(tagGroup.gridProps.value['aria-describedby']).toContain(tagGroup.descriptionProps.value.id);
    expect(tagGroup.gridProps.value['aria-describedby']).toContain(tagGroup.errorMessageProps.value.id);

    tagGroup.gridProps.value.onFocusin();
    expect(tagGroup.gridProps.value['aria-live']).toBe('polite');
    tagGroup.gridProps.value.onFocusout();
    expect(tagGroup.gridProps.value['aria-live']).toBe('off');

    let reactTag = useAriaTag({
      item: tagGroup.collection.value.items[0],
      tagGroup
    });
    let vueTag = useAriaTag({
      item: tagGroup.collection.value.items[1],
      tagGroup
    });
    let svelteTag = useAriaTag({
      item: tagGroup.collection.value.items[2],
      tagGroup
    });

    expect(reactTag.allowsRemoving.value).toBe(true);
    expect(reactTag.rowProps.value.role).toBe('row');
    expect(reactTag.gridCellProps.value.role).toBe('gridcell');
    expect(reactTag.rowProps.value.tabIndex).toBe(0);
    expect(svelteTag.isDisabled.value).toBe(true);
    expect(svelteTag.rowProps.value.tabIndex).toBe(-1);

    let preventDeleteDefault = vi.fn();
    reactTag.rowProps.value.onKeyDown?.({
      key: 'Delete',
      preventDefault: preventDeleteDefault
    } as unknown as KeyboardEvent);
    expect(preventDeleteDefault).toHaveBeenCalledTimes(1);
    expect(removedKeys).toEqual([['react']]);

    selectedKeys.value = new Set(['react', 'vue']);
    reactTag.rowProps.value.onKeyDown?.({
      key: 'Backspace',
      preventDefault: vi.fn()
    } as unknown as KeyboardEvent);
    expect(removedKeys).toEqual([['react'], ['react', 'vue']]);

    selectedKeys.value = new Set();
    vueTag.removeButtonProps.value.onPress();
    expect(removedKeys).toEqual([['react'], ['react', 'vue'], ['vue']]);

    svelteTag.removeButtonProps.value.onPress();
    expect(removedKeys).toEqual([['react'], ['react', 'vue'], ['vue']]);
  });

  it('computes vue-aria tabs semantics and manual activation behavior', () => {
    let selectedKey = ref<string | null>('overview');
    let focusedKey = ref<string | null>('overview');
    let tabList = useAriaTabList({
      ariaLabel: 'Project sections',
      focusedKey,
      keyboardActivation: 'manual',
      selectedKey,
      tabs: ['overview', 'details', 'history'],
      disabledKeys: ['history']
    });

    expect(tabList.tabListProps.value.role).toBe('tablist');
    expect(tabList.tabListProps.value['aria-label']).toBe('Project sections');
    expect(tabList.tabListProps.value['aria-orientation']).toBe('horizontal');

    let overviewTab = useAriaTab({
      key: 'overview'
    }, tabList.state);
    let detailsTab = useAriaTab({
      key: 'details'
    }, tabList.state);
    let historyTab = useAriaTab({
      key: 'history'
    }, tabList.state);

    expect(overviewTab.isSelected.value).toBe(true);
    expect(detailsTab.isSelected.value).toBe(false);
    expect(historyTab.isDisabled.value).toBe(true);

    let preventArrowDefault = vi.fn();
    tabList.tabListProps.value.onKeyDown({
      key: 'ArrowRight',
      preventDefault: preventArrowDefault
    } as unknown as KeyboardEvent);
    expect(preventArrowDefault).toHaveBeenCalledTimes(1);
    expect(focusedKey.value).toBe('details');
    expect(selectedKey.value).toBe('overview');

    let preventEnterDefault = vi.fn();
    tabList.tabListProps.value.onKeyDown({
      key: 'Enter',
      preventDefault: preventEnterDefault
    } as unknown as KeyboardEvent);
    expect(preventEnterDefault).toHaveBeenCalledTimes(1);
    expect(selectedKey.value).toBe('details');
    expect(detailsTab.isSelected.value).toBe(true);
    expect(detailsTab.tabProps.value['aria-controls']).toBe(tabList.state.getTabPanelId('details'));

    historyTab.press();
    expect(selectedKey.value).toBe('details');

    let tabPanel = useAriaTabPanel({
      'aria-describedby': 'project-tabs-help'
    }, tabList.state);
    expect(tabPanel.tabPanelProps.value.role).toBe('tabpanel');
    expect(tabPanel.tabPanelProps.value.id).toBe(tabList.state.getTabPanelId('details'));
    expect(tabPanel.tabPanelProps.value['aria-labelledby']).toBe(tabList.state.getTabId('details'));
    expect(tabPanel.tabPanelProps.value.tabIndex).toBe(0);
    expect(tabPanel.tabPanelProps.value['aria-describedby']).toBe('project-tabs-help');

    let composedTabList = useAriaTabList({
      'aria-label': 'Project sections',
      'aria-labelledby': 'external-tablist-label',
      id: 'project-tablist',
      selectedKey: ref('overview'),
      tabs: ['overview', 'details']
    });

    let composedTabListIds = composedTabList.tabListProps.value['aria-labelledby']?.split(/\s+/) ?? [];
    expect(composedTabListIds).toContain('external-tablist-label');
    expect(composedTabListIds).toContain('project-tablist');
    expect(composedTabList.tabListProps.value['aria-label']).toBe('Project sections');

    let composedTabPanel = useAriaTabPanel({
      'aria-label': 'Section panel',
      id: 'project-tabpanel',
      selectedKey: ref('overview')
    }, composedTabList.state);
    let composedTabPanelIds = composedTabPanel.tabPanelProps.value['aria-labelledby']?.split(/\s+/) ?? [];
    expect(composedTabPanelIds).toContain(composedTabList.state.getTabId('overview'));
    expect(composedTabPanelIds).toContain('project-tabpanel');
    expect(composedTabPanel.tabPanelProps.value['aria-label']).toBe('Section panel');
  });

  it('warns when vue-aria tab panel is used without tab list state', () => {
    let errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    try {
      let tabPanel = useAriaTabPanel({}, null);
      expect(tabPanel.tabPanelProps.value.id).toBe('vue-tabpanel');
      expect(errorSpy).toHaveBeenCalledWith('There is no tab id, please check if you have rendered the tab panel before the tab list.');
    } finally {
      errorSpy.mockRestore();
    }
  });

  it('runs vue-aria test-utils long press and tester baselines', async () => {
    let previousMarkup = document.body.innerHTML;
    document.body.innerHTML = `
      <div role="tablist">
        <button role="tab">Overview</button>
        <button role="tab">Details</button>
      </div>
      <button data-testid="long-press-target">Hold</button>
    `;

    try {
      let tabList = document.querySelector('[role="tablist"]');
      let tabs = Array.from(document.querySelectorAll('[role="tab"]'));
      let longPressTarget = document.querySelector('[data-testid="long-press-target"]');
      if (!(tabList instanceof HTMLElement) || !(longPressTarget instanceof HTMLElement) || tabs.length < 2) {
        throw new Error('Expected test-utils target elements');
      }

      let events: string[] = [];
      tabs[1]?.addEventListener('click', () => {
        events.push('tab-click');
      });
      longPressTarget.addEventListener('pointerdown', () => {
        events.push('pointerdown');
      });
      longPressTarget.addEventListener('click', () => {
        events.push('longpress-click');
      });

      let user = new VueAriaUser({
        advanceTimer: async () => {}
      });
      let tabsTester = user.createTester('Tabs', {
        root: tabList
      });

      await tabsTester.triggerTab({tab: 1});
      await triggerVueAriaLongPress({
        element: longPressTarget,
        advanceTimer: async () => {}
      });

      expect(vueAriaPointerMap.some((entry) => entry.name === 'MouseLeft')).toBe(true);
      expect(tabsTester.tabs).toHaveLength(2);
      expect(events).toEqual(['tab-click', 'pointerdown', 'longpress-click']);
    } finally {
      document.body.innerHTML = previousMarkup;
    }
  });

  it('re-exports vue-spectrum test-utils and simulates viewport width helpers', () => {
    let previousWidthDescriptor = Object.getOwnPropertyDescriptor(window.screen, 'width');

    try {
      simulateSpectrumMobile(640);
      expect(window.screen.width).toBe(640);

      simulateSpectrumMobile(900);
      expect(window.screen.width).toBe(700);

      simulateSpectrumDesktop(640);
      expect(window.screen.width).toBe(701);

      simulateSpectrumDesktop(1200);
      expect(window.screen.width).toBe(1200);
      expect(spectrumPointerMap).toBe(vueAriaPointerMap);
    } finally {
      if (previousWidthDescriptor) {
        Object.defineProperty(window.screen, 'width', previousWidthDescriptor);
      }
    }
  });

  it('exposes vue-spectrum utils helpers for classes, media query state, and dom refs', () => {
    let originalMatchMedia = window.matchMedia;
    let warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

    try {
      window.matchMedia = ((query: string) => ({
        matches: query === '(max-width: 700px)',
        media: query,
        onchange: null,
        addEventListener: () => {},
        removeEventListener: () => {},
        addListener: () => {},
        removeListener: () => {},
        dispatchEvent: () => true
      })) as typeof window.matchMedia;

      expect(spectrumClassNames({}, 'base', {nested: true, active: true, disabled: false}, {ready: true})).toBe('base nested active ready');
      expect(shouldKeepSpectrumClasses).toBe(false);
      keepSpectrumClasses();
      expect(shouldKeepSpectrumClasses).toBe(true);
      expect(warn).toHaveBeenCalledWith('Legacy spectrum-prefixed class names enabled for backward compatibility. We recommend replacing instances of CSS overrides targeting spectrum selectors in your app with custom class names of your own, and disabling this flag.');

      let mediaMatches = useSpectrumMediaQuery('(max-width: 700px)');
      let isMobile = useSpectrumIsMobileDevice();
      expect(mediaMatches).toBe(true);
      expect(typeof isMobile).toBe('boolean');

      useSpectrumStyleProps({
        className: 'unsafe-class',
        style: {
          color: 'red'
        }
      });
      expect(warn).toHaveBeenCalledWith('The className prop is unsafe and is unsupported in React Spectrum v3. Please use style props with Spectrum variables, or UNSAFE_className if you absolutely must do something custom. Note that this may break in future versions due to DOM structure changes.');
      expect(warn).toHaveBeenCalledWith('The style prop is unsafe and is unsupported in React Spectrum v3. Please use style props with Spectrum variables, or UNSAFE_style if you absolutely must do something custom. Note that this may break in future versions due to DOM structure changes.');

      let element = document.createElement('div');
      let externalDomRef = {current: null};
      let domRef = useSpectrumDOMRef<HTMLDivElement>(externalDomRef);
      domRef.current = element;
      expect(unwrapSpectrumDOMRef(externalDomRef).current).toBe(element);

      let createdRef = createSpectrumDOMRef({current: element});
      expect(createdRef.UNSAFE_getDOMNode()).toBe(element);
      expect(unwrapSpectrumDOMRef({current: createdRef}).current).toBe(element);
    } finally {
      warn.mockRestore();
      window.matchMedia = originalMatchMedia;
    }
  });

  it('computes vue-aria textfield validation and formatted input guards', () => {
    let inputValue = ref('Roadmap');
    let inputChanges: string[] = [];
    let textField = useAriaTextField({
      inputValue,
      isRequired: true,
      label: 'Project name',
      onInputChange: (value) => {
        inputChanges.push(value);
      },
      placeholder: 'Enter name',
      validationBehavior: 'aria'
    });

    expect(textField.inputProps.value.type).toBe('text');
    expect(textField.inputProps.value['aria-required']).toBe(true);
    expect(textField.labelProps.value.id).toBeDefined();
    expect(textField.inputProps.value.placeholder).toBe('Enter name');

    textField.inputProps.value.onInput('Vue migration');
    expect(inputValue.value).toBe('Vue migration');
    expect(inputChanges).toEqual(['Vue migration']);
    expect(textField.isInvalid.value).toBe(false);

    textField.inputProps.value.onInput('');
    expect(textField.isInvalid.value).toBe(true);
    expect(textField.validationErrors.value).toEqual(['Value is required.']);

    let formattedValue = ref('123');
    let formattedInputRef = ref<HTMLInputElement | null>(document.createElement('input'));
    let formattedChanges: string[] = [];
    let formattedField = useAriaFormattedTextField({
      ariaLabel: 'Ticket number',
      inputValue: formattedValue
    }, {
      validate: (value) => /^\d*$/.test(value),
      setInputValue: (value) => {
        formattedChanges.push(value);
      }
    }, formattedInputRef);

    formattedField.inputProps.value.onInput('1234');
    expect(formattedValue.value).toBe('1234');
    expect(formattedChanges).toEqual(['1234']);

    formattedField.inputProps.value.onInput('1234a');
    expect(formattedValue.value).toBe('1234');
    expect(formattedChanges).toEqual(['1234']);

    let fixedLengthValue = ref('1234');
    let fixedLengthInputRef = ref<HTMLInputElement | null>(document.createElement('input'));
    fixedLengthInputRef.value.value = '1234';
    fixedLengthInputRef.value.setSelectionRange(4, 4);
    let fixedLengthField = useAriaFormattedTextField({
      ariaLabel: 'PIN',
      inputValue: fixedLengthValue
    }, {
      validate: (value) => /^\d{4}$/.test(value),
      setInputValue: () => {}
    }, fixedLengthInputRef);

    let preventDeletion = vi.fn();
    fixedLengthField.inputProps.value.onBeforeInput?.({
      data: null,
      inputType: 'deleteContentBackward',
      preventDefault: preventDeletion
    } as unknown as InputEvent);
    expect(preventDeletion).toHaveBeenCalledTimes(1);
  });

  it('computes vue-aria toast region and toast item semantics', () => {
    let pausedCount = 0;
    let resumedCount = 0;
    let closedKeys: Array<string | number> = [];
    let timerResets: number[] = [];

    let toastState = {
      visibleToasts: [
        {
          key: 'build-complete',
          timeout: 4000,
          timer: {
            pause: () => {},
            reset: (timeout: number) => {
              timerResets.push(timeout);
            }
          }
        }
      ],
      pauseAll: () => {
        pausedCount += 1;
      },
      resumeAll: () => {
        resumedCount += 1;
      },
      close: (key: string | number) => {
        closedKeys.push(key);
      }
    };

    let toastRegion = useAriaToastRegion({}, toastState);
    expect(toastRegion.regionProps.value.role).toBe('region');
    expect(toastRegion.regionProps.value['aria-label']).toBe('Notifications (1)');
    toastRegion.regionProps.value.onPointerEnter();
    expect(pausedCount).toBe(1);
    toastRegion.regionProps.value.onPointerLeave();
    expect(resumedCount).toBe(1);

    let toast = useAriaToast({
      toast: toastState.visibleToasts[0]
    }, toastState);
    expect(timerResets).toEqual([4000]);
    expect(toast.toastProps.value.role).toBe('alertdialog');
    expect(toast.contentProps.value.role).toBe('alert');
    expect(toast.closeButtonProps.value['aria-label']).toBe('Close');

    toast.closeButtonProps.value.onPress();
    expect(closedKeys).toEqual(['build-complete']);
  });

  it('computes vue-aria table wrappers and selection helpers', () => {
    let selectedKeys = ref(new Set<string>());
    let collection = {
      columnCount: 2,
      rows: [
        {
          key: 'row-1',
          index: 0,
          textValue: 'Backlog',
          cells: [
            {key: 'row-1-cell-1', colIndex: 0, textValue: 'Backlog'},
            {key: 'row-1-cell-2', colIndex: 1, textValue: 'Open'}
          ]
        },
        {
          key: 'row-2',
          index: 1,
          textValue: 'Done',
          cells: [
            {key: 'row-2-cell-1', colIndex: 0, textValue: 'Done'},
            {key: 'row-2-cell-2', colIndex: 1, textValue: 'Closed'}
          ]
        }
      ]
    };

    let table = useAriaTable({
      ariaLabel: 'Tickets table',
      collection,
      selectedKeys,
      selectionMode: 'multiple'
    });
    expect(table.gridProps.value.role).toBe('grid');
    expect(table.gridProps.value['aria-label']).toBe('Tickets table');

    let rowGroup = useAriaTableRowGroup();
    expect(rowGroup.rowGroupProps.value.role).toBe('rowgroup');

    let headerRow = useAriaTableHeaderRow({
      isVirtualized: true,
      row: collection.rows[0]
    });
    expect(headerRow.rowProps.value['aria-rowindex']).toBe(1);

    let row = useAriaTableRow({
      grid: table,
      row: collection.rows[0]
    });
    row.press();
    expect(Array.from(selectedKeys.value)).toEqual(['row-1']);

    let cell = useAriaTableCell({
      cell: collection.rows[0].cells[0],
      grid: table,
      row: collection.rows[0]
    });
    cell.focus();
    expect(table.focusedKey.value).toBe('row-1-cell-1');

    let sortedColumns: string[] = [];
    let columnHeader = useAriaTableColumnHeader({
      allowsSorting: true,
      columnKey: 'row-1-cell-1',
      onSort: (columnKey) => {
        sortedColumns.push(String(columnKey));
      },
      table
    });
    columnHeader.press();
    expect(sortedColumns).toEqual(['row-1-cell-1']);
    expect(columnHeader.columnHeaderProps.value.role).toBe('columnheader');
    expect(columnHeader.columnHeaderProps.value['aria-sort']).toBe('none');

    let rowSelectionCheckbox = useAriaTableSelectionCheckbox({
      grid: table,
      key: 'row-1'
    });
    rowSelectionCheckbox.toggleSelection();
    expect(table.isSelected('row-1')).toBe(false);
    expect(rowSelectionCheckbox.checkboxProps.value.id).toContain('vue-grid-selection-checkbox-');

    let rowLabelledSelectionCheckbox = useAriaTableSelectionCheckbox({
      grid: table,
      key: 'row-1',
      rowLabelledBy: 'row-1-label'
    });
    let rowSelectionLabelledBy = rowLabelledSelectionCheckbox.checkboxProps.value['aria-labelledby']?.split(/\s+/) ?? [];
    expect(rowSelectionLabelledBy).toContain(rowLabelledSelectionCheckbox.checkboxProps.value.id);
    expect(rowSelectionLabelledBy).toContain('row-1-label');

    let selectAllCheckbox = useAriaTableSelectAllCheckbox({
      keys: collection.rows.map((rowItem) => rowItem.key),
      selectedKeys,
      selectionMode: 'multiple'
    });
    selectAllCheckbox.toggleSelectAll();
    expect(Array.from(selectedKeys.value).sort()).toEqual(['row-1', 'row-2']);
    expect(selectAllCheckbox.checkboxProps.value.checked).toBe(true);

    let columnWidth = ref(240);
    let resizeUpdates: number[] = [];
    let columnResize = useAriaTableColumnResize({
      ariaLabel: 'Resize status column',
      maxWidth: 400,
      minWidth: 120,
      onResize: (nextWidth) => {
        resizeUpdates.push(nextWidth);
      },
      width: columnWidth
    });
    columnResize.resizerProps.value.onPointerDown();
    expect(columnResize.isResizing.value).toBe(true);
    columnResize.inputProps.value.onChange('500');
    expect(columnWidth.value).toBe(400);
    expect(resizeUpdates).toEqual([400]);
    columnResize.resizerProps.value.onPointerUp();
    expect(columnResize.isResizing.value).toBe(false);
  });

  it('announces and clears live region messages with vue-aria live announcer', () => {
    destroyAnnouncer();

    let label = document.createElement('span');
    label.id = 'live-announcer-label';
    label.textContent = 'Linked announcement';
    document.body.append(label);

    try {
      announce('List item selected', 'polite', 500);
      let liveRegionRoot = document.querySelector('[data-live-announcer=\"true\"]');
      expect(liveRegionRoot).not.toBeNull();
      expect(liveRegionRoot?.textContent).toContain('List item selected');

      announce({'aria-labelledby': 'live-announcer-label'}, 'assertive', 500);
      let imageAnnouncement = document.querySelector('[data-live-announcer=\"true\"] [role=\"img\"]');
      expect(imageAnnouncement?.getAttribute('aria-labelledby')).toBe('live-announcer-label');

      clearAnnouncer('polite');
      let politeLog = document.querySelector('[data-live-announcer=\"true\"] [aria-live=\"polite\"]');
      expect(politeLog?.textContent).toBe('');
    } finally {
      destroyAnnouncer();
      document.body.removeChild(label);
    }
  });

  it('handles vue-aria interactions focus, keyboard, and press callbacks', () => {
    let focusChanges: boolean[] = [];
    let focusEvents: string[] = [];
    let keyboardEvents: string[] = [];
    let pressEvents: string[] = [];
    let pressChanges: boolean[] = [];

    let focus = useFocus({
      onBlur: () => {
        focusEvents.push('blur');
      },
      onFocus: () => {
        focusEvents.push('focus');
      },
      onFocusChange: (isFocused) => {
        focusChanges.push(isFocused);
      }
    });

    let keyboard = useKeyboard({
      onKeyDown: (event) => {
        keyboardEvents.push(`down:${event.key}`);
      },
      onKeyUp: (event) => {
        keyboardEvents.push(`up:${event.key}`);
      }
    });

    let press = usePress({
      onPress: () => {
        pressEvents.push('press');
      },
      onPressChange: (isPressed) => {
        pressChanges.push(isPressed);
      },
      onPressEnd: () => {
        pressEvents.push('end');
      },
      onPressStart: () => {
        pressEvents.push('start');
      },
      onPressUp: () => {
        pressEvents.push('up');
      }
    });

    let button = document.createElement('button');
    document.body.append(button);

    try {
      if (focus.focusProps.value.onFocus) {
        button.addEventListener('focus', focus.focusProps.value.onFocus as EventListener);
      }
      if (focus.focusProps.value.onBlur) {
        button.addEventListener('blur', focus.focusProps.value.onBlur as EventListener);
      }
      if (keyboard.keyboardProps.value.onKeyDown) {
        button.addEventListener('keydown', keyboard.keyboardProps.value.onKeyDown as EventListener);
      }
      if (keyboard.keyboardProps.value.onKeyUp) {
        button.addEventListener('keyup', keyboard.keyboardProps.value.onKeyUp as EventListener);
      }
      if (press.pressProps.value.onKeyDown) {
        button.addEventListener('keydown', press.pressProps.value.onKeyDown as EventListener);
      }
      if (press.pressProps.value.onKeyUp) {
        button.addEventListener('keyup', press.pressProps.value.onKeyUp as EventListener);
      }
      if (press.pressProps.value.onClick) {
        button.addEventListener('click', press.pressProps.value.onClick as EventListener);
      }
      if (press.pressProps.value.onBlur) {
        button.addEventListener('blur', press.pressProps.value.onBlur as EventListener);
      }

      button.focus();
      button.dispatchEvent(new KeyboardEvent('keydown', {bubbles: true, key: 'Enter'}));
      button.dispatchEvent(new KeyboardEvent('keyup', {bubbles: true, key: 'Enter'}));
      button.blur();

      expect(focusEvents).toEqual(['focus', 'blur']);
      expect(focusChanges).toEqual([true, false]);
      expect(keyboardEvents).toEqual(['down:Enter', 'up:Enter']);
      expect(pressEvents).toEqual(['start', 'up', 'end', 'press']);
      expect(pressChanges).toEqual([true, false]);
      expect(press.isPressed.value).toBe(false);
    } finally {
      document.body.removeChild(button);
    }
  });

  it('stops vue-aria keyboard bubbling by default and allows continuePropagation opt-in', () => {
    let wrapperEvents: string[] = [];
    let outer = document.createElement('div');
    let innerStopped = document.createElement('button');
    let innerContinued = document.createElement('button');
    outer.append(innerStopped, innerContinued);
    document.body.append(outer);

    let keyboardStopped = useKeyboard({
      onKeyDown: () => {},
      onKeyUp: () => {}
    });
    let keyboardContinued = useKeyboard({
      onKeyDown: (event) => {
        (event as KeyboardEvent & {continuePropagation?: () => void}).continuePropagation?.();
      },
      onKeyUp: (event) => {
        (event as KeyboardEvent & {continuePropagation?: () => void}).continuePropagation?.();
      }
    });

    try {
      outer.addEventListener('keydown', () => {
        wrapperEvents.push('down');
      });
      outer.addEventListener('keyup', () => {
        wrapperEvents.push('up');
      });

      if (keyboardStopped.keyboardProps.value.onKeyDown) {
        innerStopped.addEventListener('keydown', keyboardStopped.keyboardProps.value.onKeyDown as EventListener);
      }
      if (keyboardStopped.keyboardProps.value.onKeyUp) {
        innerStopped.addEventListener('keyup', keyboardStopped.keyboardProps.value.onKeyUp as EventListener);
      }

      innerStopped.dispatchEvent(new KeyboardEvent('keydown', {bubbles: true, key: 'A'}));
      innerStopped.dispatchEvent(new KeyboardEvent('keyup', {bubbles: true, key: 'A'}));
      expect(wrapperEvents).toEqual([]);

      if (keyboardContinued.keyboardProps.value.onKeyDown) {
        innerContinued.addEventListener('keydown', keyboardContinued.keyboardProps.value.onKeyDown as EventListener);
      }
      if (keyboardContinued.keyboardProps.value.onKeyUp) {
        innerContinued.addEventListener('keyup', keyboardContinued.keyboardProps.value.onKeyUp as EventListener);
      }

      innerContinued.dispatchEvent(new KeyboardEvent('keydown', {bubbles: true, key: 'B'}));
      innerContinued.dispatchEvent(new KeyboardEvent('keyup', {bubbles: true, key: 'B'}));
      expect(wrapperEvents).toEqual(['down', 'up']);
    } finally {
      document.body.removeChild(outer);
    }
  });

  it('warns when wrapped vue-aria keyboard handlers call stopPropagation directly', () => {
    let errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    let keyboard = useKeyboard({
      onKeyDown: (event) => {
        event.stopPropagation();
      }
    });
    let button = document.createElement('button');
    document.body.append(button);

    try {
      if (keyboard.keyboardProps.value.onKeyDown) {
        button.addEventListener('keydown', keyboard.keyboardProps.value.onKeyDown as EventListener);
      }

      button.dispatchEvent(new KeyboardEvent('keydown', {bubbles: true, key: 'A'}));
      expect(errorSpy).toHaveBeenCalledWith('stopPropagation is now the default behavior for events in React Spectrum. You can use continuePropagation() to revert this behavior.');
    } finally {
      errorSpy.mockRestore();
      document.body.removeChild(button);
    }
  });

  it('merges vue-aria press responder context handlers with local usePress handlers', () => {
    let pressEvents: string[] = [];
    let restorePressResponder = PressResponder({
      onPress: () => {
        pressEvents.push('context-press');
      },
      onPressStart: () => {
        pressEvents.push('context-start');
      }
    });
    let press = usePress({
      onPress: () => {
        pressEvents.push('local-press');
      },
      onPressStart: () => {
        pressEvents.push('local-start');
      }
    });
    let button = document.createElement('button');
    document.body.append(button);

    try {
      if (press.pressProps.value.onKeyDown) {
        button.addEventListener('keydown', press.pressProps.value.onKeyDown as EventListener);
      }
      if (press.pressProps.value.onKeyUp) {
        button.addEventListener('keyup', press.pressProps.value.onKeyUp as EventListener);
      }
      if (press.pressProps.value.onClick) {
        button.addEventListener('click', press.pressProps.value.onClick as EventListener);
      }
      if (press.pressProps.value.onBlur) {
        button.addEventListener('blur', press.pressProps.value.onBlur as EventListener);
      }

      button.dispatchEvent(new KeyboardEvent('keydown', {bubbles: true, key: 'Enter'}));
      button.dispatchEvent(new KeyboardEvent('keyup', {bubbles: true, key: 'Enter'}));

      expect(pressEvents).toEqual(['context-start', 'local-start', 'context-press', 'local-press']);
    } finally {
      restorePressResponder();
      ClearPressResponder();
      document.body.removeChild(button);
    }
  });

  it('clears vue-aria press responder context handlers', () => {
    let contextPressEvents: string[] = [];
    let localPressEvents: string[] = [];
    let restorePressResponder = PressResponder({
      onPress: () => {
        contextPressEvents.push('context');
      }
    });
    ClearPressResponder();
    let press = usePress({
      onPress: () => {
        localPressEvents.push('local');
      }
    });
    let button = document.createElement('button');
    document.body.append(button);

    try {
      if (press.pressProps.value.onKeyDown) {
        button.addEventListener('keydown', press.pressProps.value.onKeyDown as EventListener);
      }
      if (press.pressProps.value.onKeyUp) {
        button.addEventListener('keyup', press.pressProps.value.onKeyUp as EventListener);
      }
      if (press.pressProps.value.onClick) {
        button.addEventListener('click', press.pressProps.value.onClick as EventListener);
      }
      if (press.pressProps.value.onBlur) {
        button.addEventListener('blur', press.pressProps.value.onBlur as EventListener);
      }

      button.dispatchEvent(new KeyboardEvent('keydown', {bubbles: true, key: 'Enter'}));
      button.dispatchEvent(new KeyboardEvent('keyup', {bubbles: true, key: 'Enter'}));

      expect(contextPressEvents).toEqual([]);
      expect(localPressEvents).toEqual(['local']);
    } finally {
      restorePressResponder();
      ClearPressResponder();
      document.body.removeChild(button);
    }
  });

  it('warns when vue-aria press responder has no pressable child', async () => {
    let warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    let restorePressResponder = PressResponder();

    await Promise.resolve();
    expect(warnSpy).toHaveBeenCalledWith('A PressResponder was rendered without a pressable child. Either call the usePress hook, or wrap your DOM node with <Pressable> component.');

    restorePressResponder();
    ClearPressResponder();
    warnSpy.mockRestore();
  });

  it('ignores vue-aria focus callbacks when active element does not match event target', () => {
    let focusEvents: string[] = [];
    let focus = useFocus({
      onFocus: () => {
        focusEvents.push('focus');
      },
      onFocusChange: (isFocused) => {
        focusEvents.push(`change:${isFocused}`);
      }
    });
    let button = document.createElement('button');
    let other = document.createElement('button');
    document.body.append(button, other);

    try {
      if (focus.focusProps.value.onFocus) {
        button.addEventListener('focus', focus.focusProps.value.onFocus as EventListener);
      }

      other.focus();
      button.dispatchEvent(new FocusEvent('focus', {bubbles: true}));
      expect(focusEvents).toEqual([]);

      button.focus();
      focusEvents = [];
      button.dispatchEvent(new FocusEvent('focus', {bubbles: true}));
      expect(focusEvents).toEqual(['focus', 'change:true']);
    } finally {
      document.body.removeChild(button);
      document.body.removeChild(other);
    }
  });

  it('clears vue-aria focus-within when disabled and when focus moves outside without focusout', async () => {
    let isDisabled = ref(false);
    let focusWithinChanges: boolean[] = [];
    let blurWithinCount = 0;
    let focusWithin = useFocusWithin({
      isDisabled,
      onBlurWithin: () => {
        blurWithinCount++;
      },
      onFocusWithinChange: (isFocused) => {
        focusWithinChanges.push(isFocused);
      }
    });
    let container = document.createElement('div');
    let child = document.createElement('button');
    let outside = document.createElement('input');
    container.append(child);
    document.body.append(container, outside);

    try {
      if (focusWithin.focusWithinProps.value.onFocusin) {
        container.addEventListener('focusin', focusWithin.focusWithinProps.value.onFocusin as EventListener);
      }
      if (focusWithin.focusWithinProps.value.onFocusout) {
        container.addEventListener('focusout', focusWithin.focusWithinProps.value.onFocusout as EventListener);
      }

      child.focus();
      child.dispatchEvent(new FocusEvent('focusin', {bubbles: true, relatedTarget: null}));
      expect(focusWithin.isFocusWithin.value).toBe(true);

      isDisabled.value = true;
      await nextTick();
      expect(focusWithin.isFocusWithin.value).toBe(false);

      isDisabled.value = false;
      await nextTick();

      child.focus();
      child.dispatchEvent(new FocusEvent('focusin', {bubbles: true, relatedTarget: null}));
      expect(focusWithin.isFocusWithin.value).toBe(true);

      container.removeChild(child);
      outside.focus();
      outside.dispatchEvent(new FocusEvent('focus', {bubbles: true, relatedTarget: null}));

      expect(focusWithin.isFocusWithin.value).toBe(false);
      expect(focusWithinChanges).toEqual([true, false, true, false]);
      expect(blurWithinCount).toBe(2);
    } finally {
      if (child.parentElement === container) {
        container.removeChild(child);
      }
      document.body.removeChild(container);
      document.body.removeChild(outside);
    }
  });

  it('auto-focuses vue-aria focusable elements when the ref resolves on next tick', async () => {
    setInteractionModality('keyboard');
    let elementRef = ref<HTMLElement | null>(null);
    useFocusable({
      autoFocus: true
    }, elementRef);
    let button = document.createElement('button');
    document.body.append(button);

    try {
      elementRef.value = button;
      await nextTick();
      expect(document.activeElement).toBe(button);
    } finally {
      document.body.removeChild(button);
    }
  });

  it('skips vue-aria focusable provider handlers when focusable is disabled', () => {
    let contextEvents: string[] = [];
    let clearFocusableProvider = FocusableProvider({
      onFocus: () => {
        contextEvents.push('focus');
      },
      onKeyDown: () => {
        contextEvents.push('keydown');
      }
    });
    let button = document.createElement('button');
    document.body.append(button);
    let focusable = useFocusable({
      isDisabled: true
    }, ref(button));

    try {
      if (focusable.focusableProps.value.onFocus) {
        button.addEventListener('focus', focusable.focusableProps.value.onFocus as EventListener);
      }
      if (focusable.focusableProps.value.onKeyDown) {
        button.addEventListener('keydown', focusable.focusableProps.value.onKeyDown as EventListener);
      }

      button.dispatchEvent(new FocusEvent('focus', {bubbles: true}));
      button.dispatchEvent(new KeyboardEvent('keydown', {bubbles: true, key: 'Enter'}));

      expect(contextEvents).toEqual([]);
      expect(focusable.focusableProps.value.tabindex).toBeUndefined();
    } finally {
      clearFocusableProvider();
      document.body.removeChild(button);
    }
  });

  it('warns for vue-aria Focusable and Pressable ref, focusable, and role contracts', () => {
    let warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    let errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    try {
      Focusable({
        elementRef: ref<HTMLElement | null>(null)
      });
      expect(errorSpy).toHaveBeenCalledWith('<Focusable> child must forward its ref to a DOM element.');

      Pressable({
        ref: ref<Element | null>(null)
      });
      expect(errorSpy).toHaveBeenCalledWith('<Pressable> child must forward its ref to a DOM element.');

      let nonFocusable = document.createElement('div');
      Focusable({
        elementRef: ref<HTMLElement | null>(nonFocusable)
      });
      expect(warnSpy).toHaveBeenCalledWith('<Focusable> child must be focusable. Please ensure the tabIndex prop is passed through.');

      let focusableNoRole = document.createElement('div');
      focusableNoRole.tabIndex = 0;
      Focusable({
        elementRef: ref<HTMLElement | null>(focusableNoRole)
      });
      expect(warnSpy).toHaveBeenCalledWith('<Focusable> child must have an interactive ARIA role.');

      let focusableInvalidRole = document.createElement('div');
      focusableInvalidRole.tabIndex = 0;
      focusableInvalidRole.setAttribute('role', 'status');
      Focusable({
        elementRef: ref<HTMLElement | null>(focusableInvalidRole)
      });
      expect(warnSpy).toHaveBeenCalledWith('<Focusable> child must have an interactive ARIA role. Got "status".');

      let pressableNoRole = document.createElement('div');
      pressableNoRole.tabIndex = 0;
      Pressable({
        ref: ref<Element | null>(pressableNoRole)
      });
      expect(warnSpy).toHaveBeenCalledWith('<Pressable> child must have an interactive ARIA role.');

      let pressableInvalidRole = document.createElement('div');
      pressableInvalidRole.tabIndex = 0;
      pressableInvalidRole.setAttribute('role', 'status');
      Pressable({
        ref: ref<Element | null>(pressableInvalidRole)
      });
      expect(warnSpy).toHaveBeenCalledWith('<Pressable> child must have an interactive ARIA role. Got "status".');
    } finally {
      warnSpy.mockRestore();
      errorSpy.mockRestore();
    }
  });

  it('merges vue-aria pressable with focusable props for non-native targets', () => {
    let pressEvents: string[] = [];
    let target = document.createElement('div');
    target.setAttribute('role', 'button');
    target.tabIndex = 0;
    let targetRef = ref<Element | null>(target);
    let pressable = Pressable({
      onPress: () => {
        pressEvents.push('press');
      },
      ref: targetRef
    });
    document.body.append(target);

    try {
      if (pressable.pressProps.value.onKeyDown) {
        target.addEventListener('keydown', pressable.pressProps.value.onKeyDown as EventListener);
      }
      if (pressable.pressProps.value.onKeyUp) {
        target.addEventListener('keyup', pressable.pressProps.value.onKeyUp as EventListener);
      }

      target.dispatchEvent(new KeyboardEvent('keydown', {bubbles: true, key: 'Enter'}));
      target.dispatchEvent(new KeyboardEvent('keyup', {bubbles: true, key: 'Enter'}));

      expect(pressable.pressProps.value.tabindex).toBe(0);
      expect(pressable.pressProps.value.onFocus).toBeTypeOf('function');
      expect(pressEvents).toEqual(['press']);
    } finally {
      document.body.removeChild(target);
    }
  });

  it('tracks focus visibility when merging vue-aria focus ring and button props', () => {
    let focusRing = useFocusRing();
    let button = useButton();
    let mergedProps = ariaMergeProps(focusRing.focusProps.value, button.buttonProps.value);
    let element = document.createElement('button');
    document.body.append(element);

    try {
      if (mergedProps.onFocus) {
        element.addEventListener('focus', mergedProps.onFocus as EventListener);
      }
      if (mergedProps.onBlur) {
        element.addEventListener('blur', mergedProps.onBlur as EventListener);
      }

      element.dispatchEvent(new FocusEvent('focus', {bubbles: true}));
      expect(focusRing.isFocused.value).toBe(true);

      element.dispatchEvent(new FocusEvent('blur', {bubbles: true}));
      expect(focusRing.isFocused.value).toBe(false);
    } finally {
      document.body.removeChild(element);
    }
  });

  it('preserves default link behavior when vue-aria usePress handles click', () => {
    let presses = 0;
    let defaultPrevented: boolean | null = null;
    let press = usePress({
      onPress: () => {
        presses += 1;
      }
    });
    let link = document.createElement('a');
    link.href = 'https://example.com';
    document.body.append(link);

    try {
      if (press.pressProps.value.onClick) {
        link.addEventListener('click', press.pressProps.value.onClick as EventListener);
      }

      link.addEventListener('click', (event) => {
        defaultPrevented = event.defaultPrevented;
      });

      let dispatched = link.dispatchEvent(new MouseEvent('click', {bubbles: true, cancelable: true}));
      expect(dispatched).toBe(true);
      expect(defaultPrevented).toBe(false);
      expect(presses).toBe(1);
    } finally {
      document.body.removeChild(link);
    }
  });

  it('focuses vue-aria press targets on pointer interaction by default', () => {
    let button = document.createElement('button');
    let other = document.createElement('button');
    document.body.append(button, other);
    let press = usePress();

    try {
      if (press.pressProps.value.onPointerDown) {
        button.addEventListener('pointerdown', press.pressProps.value.onPointerDown as EventListener);
      }

      other.focus();
      expect(document.activeElement).toBe(other);
      button.dispatchEvent(createPointerEvent('pointerdown', {pointerId: 80}));
      expect(document.activeElement).toBe(button);
      window.dispatchEvent(createPointerEvent('pointerup', {pointerId: 80}));
    } finally {
      button.remove();
      other.remove();
    }
  });

  it('does not focus vue-aria press targets when preventFocusOnPress is enabled', () => {
    let button = document.createElement('button');
    let other = document.createElement('button');
    document.body.append(button, other);
    let press = usePress({
      preventFocusOnPress: true
    });

    try {
      if (press.pressProps.value.onPointerDown) {
        button.addEventListener('pointerdown', press.pressProps.value.onPointerDown as EventListener);
      }

      other.focus();
      expect(document.activeElement).toBe(other);
      button.dispatchEvent(createPointerEvent('pointerdown', {pointerId: 81}));
      expect(document.activeElement).toBe(other);
      window.dispatchEvent(createPointerEvent('pointerup', {pointerId: 81}));
    } finally {
      button.remove();
      other.remove();
    }
  });

  it('does not fire vue-aria press or click callbacks when disabled', () => {
    let presses = 0;
    let clicks = 0;
    let button = document.createElement('button');
    document.body.append(button);
    let press = usePress({
      isDisabled: true,
      onClick: () => {
        clicks += 1;
      },
      onPress: () => {
        presses += 1;
      }
    });

    try {
      if (press.pressProps.value.onPointerDown) {
        button.addEventListener('pointerdown', press.pressProps.value.onPointerDown as EventListener);
      }
      if (press.pressProps.value.onClick) {
        button.addEventListener('click', press.pressProps.value.onClick as EventListener);
      }

      button.dispatchEvent(createPointerEvent('pointerdown', {pointerId: 82}));
      window.dispatchEvent(createPointerEvent('pointerup', {pointerId: 82}));
      button.dispatchEvent(new MouseEvent('click', {bubbles: true, cancelable: true}));

      expect(presses).toBe(0);
      expect(clicks).toBe(0);
    } finally {
      button.remove();
    }
  });

  it('cancels vue-aria press when pointer exits and cancellation is enabled', () => {
    let events: string[] = [];
    let press = usePress({
      onPress: () => {
        events.push('press');
      },
      onPressEnd: () => {
        events.push('end');
      },
      onPressStart: () => {
        events.push('start');
      },
      shouldCancelOnPointerExit: true
    });
    let button = document.createElement('button');
    document.body.append(button);

    try {
      if (press.pressProps.value.onPointerDown) {
        button.addEventListener('pointerdown', press.pressProps.value.onPointerDown as EventListener);
      }
      if (press.pressProps.value.onPointerLeave) {
        button.addEventListener('pointerleave', press.pressProps.value.onPointerLeave as EventListener);
      }

      button.dispatchEvent(createPointerEvent('pointerdown'));
      button.dispatchEvent(createPointerEvent('pointerleave'));

      expect(events).toEqual(['start', 'end']);
      expect(press.isPressed.value).toBe(false);
    } finally {
      document.body.removeChild(button);
    }
  });

  it('binds vue-aria press global pointer listeners to the owner window', () => {
    let iframe = document.createElement('iframe');
    document.body.appendChild(iframe);
    let iframeWindow = iframe.contentWindow;
    let iframeDocument = iframeWindow?.document;
    expect(iframeWindow).toBeTruthy();
    expect(iframeDocument).toBeTruthy();
    let button = iframeDocument!.createElement('button');
    iframeDocument!.body.appendChild(button);
    let presses = 0;
    let press = usePress({
      onPress: () => {
        presses += 1;
      }
    });

    let addMainWindowListener = vi.spyOn(window, 'addEventListener');
    let addIframeWindowListener = vi.spyOn(iframeWindow!, 'addEventListener');
    let removeIframeWindowListener = vi.spyOn(iframeWindow!, 'removeEventListener');

    try {
      if (press.pressProps.value.onPointerDown) {
        button.addEventListener('pointerdown', press.pressProps.value.onPointerDown as EventListener);
      }

      button.dispatchEvent(createPointerEvent('pointerdown', {pointerId: 11}));

      let iframeListenerTypes = addIframeWindowListener.mock.calls.map(([type]) => type as string);
      let mainWindowListenerTypes = addMainWindowListener.mock.calls.map(([type]) => type as string);
      expect(iframeListenerTypes).toEqual(expect.arrayContaining(['pointerup', 'pointercancel']));
      expect(mainWindowListenerTypes).not.toContain('pointerup');
      expect(mainWindowListenerTypes).not.toContain('pointercancel');

      button.dispatchEvent(createPointerEvent('pointerup', {pointerId: 11}));
      expect(presses).toBe(1);

      let removedIframeTypes = removeIframeWindowListener.mock.calls.map(([type]) => type as string);
      expect(removedIframeTypes).toEqual(expect.arrayContaining(['pointerup', 'pointercancel']));
    } finally {
      addMainWindowListener.mockRestore();
      addIframeWindowListener.mockRestore();
      removeIframeWindowListener.mockRestore();
      iframe.remove();
    }
  });

  it('cleans up vue-aria press pointer listeners when scope is disposed mid-press', () => {
    let button = document.createElement('button');
    document.body.appendChild(button);
    let removeWindowListener = vi.spyOn(window, 'removeEventListener');

    let scope = effectScope();
    scope.run(() => {
      let press = usePress();
      if (press.pressProps.value.onPointerDown) {
        button.addEventListener('pointerdown', press.pressProps.value.onPointerDown as EventListener);
      }
    });

    try {
      button.dispatchEvent(createPointerEvent('pointerdown', {pointerId: 17}));
      scope.stop();
      let removedTypes = removeWindowListener.mock.calls.map(([type]) => type as string);
      expect(removedTypes).toEqual(expect.arrayContaining(['pointerup', 'pointercancel']));
    } finally {
      scope.stop();
      removeWindowListener.mockRestore();
      document.body.removeChild(button);
    }
  });

  it('tracks vue-aria hover/focus-within and global focus-visible state', () => {
    let hoverChanges: boolean[] = [];
    let focusWithinChanges: boolean[] = [];

    let hover = useHover({
      onHoverChange: (isHovered) => {
        hoverChanges.push(isHovered);
      }
    });

    let focusWithin = useFocusWithin({
      onFocusWithinChange: (isFocused) => {
        focusWithinChanges.push(isFocused);
      }
    });

    let focusVisible = useFocusVisible();
    let container = document.createElement('div');
    let child = document.createElement('button');
    let outside = document.createElement('button');
    container.append(child);
    document.body.append(container, outside);

    let stopWindowTracking = addWindowFocusTracking(container);

    try {
      if (hover.hoverProps.value.onPointerEnter) {
        container.addEventListener('pointerenter', hover.hoverProps.value.onPointerEnter as EventListener);
      }
      if (hover.hoverProps.value.onPointerLeave) {
        container.addEventListener('pointerleave', hover.hoverProps.value.onPointerLeave as EventListener);
      }
      if (focusWithin.focusWithinProps.value.onFocusin) {
        container.addEventListener('focusin', focusWithin.focusWithinProps.value.onFocusin as EventListener);
      }
      if (focusWithin.focusWithinProps.value.onFocusout) {
        container.addEventListener('focusout', focusWithin.focusWithinProps.value.onFocusout as EventListener);
      }

      container.dispatchEvent(createPointerEvent('pointerenter'));
      container.dispatchEvent(createPointerEvent('pointerleave'));

      child.focus();
      child.dispatchEvent(new FocusEvent('focusin', {bubbles: true, relatedTarget: null}));
      outside.focus();
      child.dispatchEvent(new FocusEvent('focusout', {bubbles: true, relatedTarget: outside}));

      setInteractionModality('pointer');
      expect(focusVisible.isFocusVisible.value).toBe(false);
      setInteractionModality('keyboard');
      expect(focusVisible.isFocusVisible.value).toBe(true);

      expect(hoverChanges).toEqual([true, false]);
      expect(focusWithinChanges).toEqual([true, false]);
    } finally {
      stopWindowTracking();
      document.body.removeChild(container);
      document.body.removeChild(outside);
    }
  });

  it('clears vue-aria hover state when interaction becomes disabled', async () => {
    let isDisabled = ref(false);
    let hover = useHover({
      isDisabled
    });
    let button = document.createElement('button');
    document.body.append(button);

    try {
      if (hover.hoverProps.value.onPointerEnter) {
        button.addEventListener('pointerenter', hover.hoverProps.value.onPointerEnter as EventListener);
      }

      button.dispatchEvent(createPointerEvent('pointerenter'));
      expect(hover.isHovered.value).toBe(true);

      isDisabled.value = true;
      await nextTick();

      expect(hover.isHovered.value).toBe(false);
    } finally {
      document.body.removeChild(button);
    }
  });

  it('ignores emulated mouse hover immediately after touch pointerup in vue-aria useHover', () => {
    vi.useFakeTimers();
    let hoverEvents: string[] = [];
    let hover = useHover({
      onHoverEnd: () => {
        hoverEvents.push('end');
      },
      onHoverStart: () => {
        hoverEvents.push('start');
      }
    });
    let button = document.createElement('button');
    document.body.append(button);

    try {
      if (hover.hoverProps.value.onPointerEnter) {
        button.addEventListener('pointerenter', hover.hoverProps.value.onPointerEnter as EventListener);
      }
      if (hover.hoverProps.value.onPointerLeave) {
        button.addEventListener('pointerleave', hover.hoverProps.value.onPointerLeave as EventListener);
      }

      if (typeof PointerEvent !== 'undefined') {
        button.dispatchEvent(createPointerEvent('pointerup', {pointerType: 'touch'}));
      } else {
        button.dispatchEvent(new Event('touchend', {bubbles: true}));
      }
      button.dispatchEvent(createPointerEvent('pointerenter', {pointerType: 'mouse'}));
      button.dispatchEvent(createPointerEvent('pointerleave', {pointerType: 'mouse'}));
      expect(hoverEvents).toEqual([]);

      vi.advanceTimersByTime(60);
      button.dispatchEvent(createPointerEvent('pointerenter', {pointerType: 'mouse'}));
      button.dispatchEvent(createPointerEvent('pointerleave', {pointerType: 'mouse'}));
      expect(hoverEvents).toEqual(['start', 'end']);
    } finally {
      vi.useRealTimers();
      document.body.removeChild(button);
    }
  });

  it('ends vue-aria hover state when pointer moves outside without pointerleave', () => {
    let hoverEvents: string[] = [];
    let hover = useHover({
      onHoverEnd: () => {
        hoverEvents.push('end');
      },
      onHoverStart: () => {
        hoverEvents.push('start');
      }
    });
    let container = document.createElement('div');
    document.body.append(container);

    try {
      if (hover.hoverProps.value.onPointerEnter) {
        container.addEventListener('pointerenter', hover.hoverProps.value.onPointerEnter as EventListener);
      }
      if (hover.hoverProps.value.onPointerLeave) {
        container.addEventListener('pointerleave', hover.hoverProps.value.onPointerLeave as EventListener);
      }

      container.dispatchEvent(createPointerEvent('pointerenter', {pointerType: 'mouse'}));
      expect(hover.isHovered.value).toBe(true);

      document.body.dispatchEvent(createPointerEvent('pointerover', {pointerType: 'mouse'}));
      expect(hover.isHovered.value).toBe(false);
      expect(hoverEvents).toEqual(['start', 'end']);
    } finally {
      document.body.removeChild(container);
    }
  });

  it('fires vue-aria interact-outside and keyboard move events', () => {
    let outsideEvents: string[] = [];
    let moveEvents: Array<{type: string, x?: number, y?: number}> = [];
    let container = document.createElement('div');
    let inside = document.createElement('button');
    let outside = document.createElement('button');
    container.append(inside);
    document.body.append(container, outside);

    let stopInteractOutside = useInteractOutside({
      onInteractOutside: () => {
        outsideEvents.push('outside');
      },
      onInteractOutsideStart: () => {
        outsideEvents.push('start');
      },
      ref: ref(container)
    });

    let move = useMove({
      onMove: (event) => {
        moveEvents.push({
          type: event.type,
          x: event.deltaX,
          y: event.deltaY
        });
      },
      onMoveEnd: (event) => {
        moveEvents.push({type: event.type});
      },
      onMoveStart: (event) => {
        moveEvents.push({type: event.type});
      }
    });

    try {
      if (move.moveProps.value.onKeyDown) {
        container.addEventListener('keydown', move.moveProps.value.onKeyDown as EventListener);
      }

      if (typeof PointerEvent !== 'undefined') {
        outside.dispatchEvent(createPointerEvent('pointerdown'));
        outside.dispatchEvent(new MouseEvent('click', {bubbles: true}));
      } else {
        outside.dispatchEvent(new MouseEvent('mousedown', {bubbles: true}));
        outside.dispatchEvent(new MouseEvent('mouseup', {bubbles: true}));
      }
      container.dispatchEvent(new KeyboardEvent('keydown', {bubbles: true, key: 'ArrowRight'}));

      expect(outsideEvents).toEqual(['start', 'outside']);
      expect(moveEvents).toEqual([
        {type: 'movestart'},
        {type: 'move', x: 1, y: 0},
        {type: 'moveend'}
      ]);
    } finally {
      stopInteractOutside();
      document.body.removeChild(container);
      document.body.removeChild(outside);
    }
  });

  it('falls back to mouse and touch events when PointerEvent is unavailable', () => {
    let outsideEvents: string[] = [];
    let container = document.createElement('div');
    let outside = document.createElement('button');
    document.body.append(container, outside);

    let originalPointerEvent = globalThis.PointerEvent;
    Object.defineProperty(globalThis, 'PointerEvent', {
      configurable: true,
      value: undefined
    });

    let stopInteractOutside = useInteractOutside({
      onInteractOutside: () => {
        outsideEvents.push('outside');
      },
      onInteractOutsideStart: () => {
        outsideEvents.push('start');
      },
      ref: ref(container)
    });

    try {
      outside.dispatchEvent(new MouseEvent('mousedown', {bubbles: true}));
      outside.dispatchEvent(new MouseEvent('mouseup', {bubbles: true}));

      outside.dispatchEvent(new Event('touchstart', {bubbles: true}));
      outside.dispatchEvent(new Event('touchend', {bubbles: true}));
      // Ignore emulated mouseup that follows touchend.
      outside.dispatchEvent(new MouseEvent('mouseup', {bubbles: true}));

      expect(outsideEvents).toEqual(['start', 'outside', 'start', 'outside']);
    } finally {
      stopInteractOutside();
      Object.defineProperty(globalThis, 'PointerEvent', {
        configurable: true,
        value: originalPointerEvent
      });
      document.body.removeChild(container);
      document.body.removeChild(outside);
    }
  });

  it('listens on the ref owner document for iframe interactions', () => {
    let iframe = document.createElement('iframe');
    document.body.appendChild(iframe);
    let iframeWindow = iframe.contentWindow;
    let iframeDocument = iframe.contentWindow?.document;
    expect(iframeDocument).toBeTruthy();
    expect(iframeWindow).toBeTruthy();
    let container = iframeDocument!.createElement('div');
    iframeDocument!.body.appendChild(container);
    let addListenerOnIframe = vi.spyOn(iframeDocument!, 'addEventListener');
    let addListenerOnDocument = vi.spyOn(document, 'addEventListener');

    let stopInteractOutside = useInteractOutside({
      onInteractOutside: () => {},
      onInteractOutsideStart: () => {},
      ref: ref(container)
    });

    try {
      let iframeEventTypes = addListenerOnIframe.mock.calls.map(([type]) => type as string);
      let documentEventTypes = addListenerOnDocument.mock.calls.map(([type]) => type as string);
      if (typeof PointerEvent !== 'undefined') {
        expect(iframeEventTypes).toEqual(expect.arrayContaining(['pointerdown', 'click']));
        expect(documentEventTypes).not.toContain('pointerdown');
        expect(documentEventTypes).not.toContain('click');
      } else {
        expect(iframeEventTypes).toEqual(expect.arrayContaining(['mousedown', 'mouseup', 'touchstart', 'touchend']));
        expect(documentEventTypes).not.toContain('mousedown');
        expect(documentEventTypes).not.toContain('mouseup');
        expect(documentEventTypes).not.toContain('touchstart');
        expect(documentEventTypes).not.toContain('touchend');
      }
    } finally {
      stopInteractOutside();
      addListenerOnIframe.mockRestore();
      addListenerOnDocument.mockRestore();
      iframe.remove();
    }
  });

  it('cleans up interact-outside listeners when the scope is disposed', () => {
    let outsideEvents: string[] = [];
    let container = document.createElement('div');
    let outside = document.createElement('button');
    document.body.append(container, outside);

    let scope = effectScope();
    scope.run(() => {
      useInteractOutside({
        onInteractOutside: () => {
          outsideEvents.push('outside');
        },
        onInteractOutsideStart: () => {
          outsideEvents.push('start');
        },
        ref: ref(container)
      });
    });

    try {
      if (typeof PointerEvent !== 'undefined') {
        outside.dispatchEvent(createPointerEvent('pointerdown'));
        outside.dispatchEvent(new MouseEvent('click', {bubbles: true}));
      } else {
        outside.dispatchEvent(new MouseEvent('mousedown', {bubbles: true}));
        outside.dispatchEvent(new MouseEvent('mouseup', {bubbles: true}));
      }
      expect(outsideEvents).toEqual(['start', 'outside']);

      scope.stop();

      if (typeof PointerEvent !== 'undefined') {
        outside.dispatchEvent(createPointerEvent('pointerdown'));
        outside.dispatchEvent(new MouseEvent('click', {bubbles: true}));
      } else {
        outside.dispatchEvent(new MouseEvent('mousedown', {bubbles: true}));
        outside.dispatchEvent(new MouseEvent('mouseup', {bubbles: true}));
      }
      expect(outsideEvents).toEqual(['start', 'outside']);
    } finally {
      scope.stop();
      document.body.removeChild(container);
      document.body.removeChild(outside);
    }
  });

  it('fires vue-aria move pointer events with deltas and end state', () => {
    let moveEvents: Array<{type: string, x?: number, y?: number}> = [];
    let container = document.createElement('div');
    document.body.append(container);

    let move = useMove({
      onMove: (event) => {
        moveEvents.push({
          type: event.type,
          x: event.deltaX,
          y: event.deltaY
        });
      },
      onMoveEnd: (event) => {
        moveEvents.push({type: event.type});
      },
      onMoveStart: (event) => {
        moveEvents.push({type: event.type});
      }
    });

    try {
      if (move.moveProps.value.onPointerDown) {
        container.addEventListener('pointerdown', move.moveProps.value.onPointerDown as EventListener);
        container.dispatchEvent(createPointerEvent('pointerdown', {pointerId: 7, pageX: 20, pageY: 30}));
        window.dispatchEvent(createPointerEvent('pointermove', {pointerId: 7, pageX: 26, pageY: 24}));
        window.dispatchEvent(createPointerEvent('pointerup', {pointerId: 7, pageX: 26, pageY: 24}));
      } else if (move.moveProps.value.onMouseDown) {
        container.addEventListener('mousedown', move.moveProps.value.onMouseDown as EventListener);
        container.dispatchEvent(new MouseEvent('mousedown', {bubbles: true, button: 0, clientX: 20, clientY: 30}));
        window.dispatchEvent(new MouseEvent('mousemove', {bubbles: true, button: 0, clientX: 26, clientY: 24}));
        window.dispatchEvent(new MouseEvent('mouseup', {bubbles: true, button: 0, clientX: 26, clientY: 24}));
      }

      expect(moveEvents).toEqual([
        {type: 'movestart'},
        {type: 'move', x: 6, y: -6},
        {type: 'moveend'}
      ]);
    } finally {
      document.body.removeChild(container);
    }
  });

  it('ignores vue-aria move starts from right click', () => {
    let moveEvents: string[] = [];
    let container = document.createElement('div');
    document.body.append(container);
    let move = useMove({
      onMove: () => {
        moveEvents.push('move');
      },
      onMoveEnd: () => {
        moveEvents.push('moveend');
      },
      onMoveStart: () => {
        moveEvents.push('movestart');
      }
    });

    try {
      if (move.moveProps.value.onPointerDown) {
        container.addEventListener('pointerdown', move.moveProps.value.onPointerDown as EventListener);
        container.dispatchEvent(createPointerEvent('pointerdown', {button: 2, pointerId: 70, pageX: 1, pageY: 1}));
        window.dispatchEvent(createPointerEvent('pointermove', {button: 2, pointerId: 70, pageX: 5, pageY: 4}));
        window.dispatchEvent(createPointerEvent('pointerup', {button: 2, pointerId: 70, pageX: 5, pageY: 4}));
      } else if (move.moveProps.value.onMouseDown) {
        container.addEventListener('mousedown', move.moveProps.value.onMouseDown as EventListener);
        container.dispatchEvent(new MouseEvent('mousedown', {bubbles: true, button: 2, clientX: 1, clientY: 1}));
        window.dispatchEvent(new MouseEvent('mousemove', {bubbles: true, button: 2, clientX: 5, clientY: 4}));
        window.dispatchEvent(new MouseEvent('mouseup', {bubbles: true, button: 2, clientX: 5, clientY: 4}));
      }

      expect(moveEvents).toEqual([]);
    } finally {
      document.body.removeChild(container);
    }
  });

  it('does not emit vue-aria move events when pointer only clicks without movement', () => {
    let moveEvents: string[] = [];
    let container = document.createElement('div');
    document.body.append(container);
    let move = useMove({
      onMove: () => {
        moveEvents.push('move');
      },
      onMoveEnd: () => {
        moveEvents.push('moveend');
      },
      onMoveStart: () => {
        moveEvents.push('movestart');
      }
    });

    try {
      if (move.moveProps.value.onPointerDown) {
        container.addEventListener('pointerdown', move.moveProps.value.onPointerDown as EventListener);
        container.dispatchEvent(createPointerEvent('pointerdown', {pointerId: 71, pageX: 10, pageY: 10}));
        window.dispatchEvent(createPointerEvent('pointerup', {pointerId: 71, pageX: 10, pageY: 10}));
      } else if (move.moveProps.value.onMouseDown) {
        container.addEventListener('mousedown', move.moveProps.value.onMouseDown as EventListener);
        container.dispatchEvent(new MouseEvent('mousedown', {bubbles: true, button: 0, clientX: 10, clientY: 10}));
        window.dispatchEvent(new MouseEvent('mouseup', {bubbles: true, button: 0, clientX: 10, clientY: 10}));
      }

      expect(moveEvents).toEqual([]);
    } finally {
      document.body.removeChild(container);
    }
  });

  it('does not bubble vue-aria move starts to parent move handlers', () => {
    let childEvents: string[] = [];
    let parentEvents: string[] = [];
    let container = document.createElement('div');
    let child = document.createElement('div');
    container.append(child);
    document.body.append(container);

    let parentMove = useMove({
      onMove: () => {
        parentEvents.push('move');
      },
      onMoveEnd: () => {
        parentEvents.push('moveend');
      },
      onMoveStart: () => {
        parentEvents.push('movestart');
      }
    });
    let childMove = useMove({
      onMove: () => {
        childEvents.push('move');
      },
      onMoveEnd: () => {
        childEvents.push('moveend');
      },
      onMoveStart: () => {
        childEvents.push('movestart');
      }
    });

    try {
      if (parentMove.moveProps.value.onPointerDown && childMove.moveProps.value.onPointerDown) {
        container.addEventListener('pointerdown', parentMove.moveProps.value.onPointerDown as EventListener);
        child.addEventListener('pointerdown', childMove.moveProps.value.onPointerDown as EventListener);

        child.dispatchEvent(createPointerEvent('pointerdown', {pointerId: 72, pageX: 3, pageY: 3}));
        window.dispatchEvent(createPointerEvent('pointermove', {pointerId: 72, pageX: 6, pageY: 1}));
        window.dispatchEvent(createPointerEvent('pointerup', {pointerId: 72, pageX: 6, pageY: 1}));
      } else if (parentMove.moveProps.value.onMouseDown && childMove.moveProps.value.onMouseDown) {
        container.addEventListener('mousedown', parentMove.moveProps.value.onMouseDown as EventListener);
        child.addEventListener('mousedown', childMove.moveProps.value.onMouseDown as EventListener);

        child.dispatchEvent(new MouseEvent('mousedown', {bubbles: true, button: 0, clientX: 3, clientY: 3}));
        window.dispatchEvent(new MouseEvent('mousemove', {bubbles: true, button: 0, clientX: 6, clientY: 1}));
        window.dispatchEvent(new MouseEvent('mouseup', {bubbles: true, button: 0, clientX: 6, clientY: 1}));
      }

      expect(childEvents).toEqual(['movestart', 'move', 'moveend']);
      expect(parentEvents).toEqual([]);
    } finally {
      document.body.removeChild(container);
    }
  });

  it('falls back to vue-aria mouse move handlers when PointerEvent is unavailable', () => {
    let moveEvents: Array<{type: string, x?: number, y?: number}> = [];
    let container = document.createElement('div');
    document.body.append(container);
    let originalPointerEvent = globalThis.PointerEvent;
    Object.defineProperty(globalThis, 'PointerEvent', {
      configurable: true,
      value: undefined
    });

    let move = useMove({
      onMove: (event) => {
        moveEvents.push({type: event.type, x: event.deltaX, y: event.deltaY});
      },
      onMoveEnd: (event) => {
        moveEvents.push({type: event.type});
      },
      onMoveStart: (event) => {
        moveEvents.push({type: event.type});
      }
    });

    try {
      if (move.moveProps.value.onMouseDown) {
        container.addEventListener('mousedown', move.moveProps.value.onMouseDown as EventListener);
      }
      expect(move.moveProps.value.onPointerDown).toBeUndefined();

      container.dispatchEvent(new MouseEvent('mousedown', {bubbles: true, button: 0, clientX: 5, clientY: 8}));
      window.dispatchEvent(new MouseEvent('mousemove', {bubbles: true, button: 0, clientX: 11, clientY: 3}));
      window.dispatchEvent(new MouseEvent('mouseup', {bubbles: true, button: 0, clientX: 11, clientY: 3}));

      expect(moveEvents).toEqual([
        {type: 'movestart'},
        {type: 'move', x: 6, y: -5},
        {type: 'moveend'}
      ]);
    } finally {
      Object.defineProperty(globalThis, 'PointerEvent', {
        configurable: true,
        value: originalPointerEvent
      });
      document.body.removeChild(container);
    }
  });

  it('falls back to vue-aria touch move handlers when PointerEvent is unavailable', () => {
    let moveEvents: Array<{type: string, x?: number, y?: number}> = [];
    let container = document.createElement('div');
    document.body.append(container);
    let originalPointerEvent = globalThis.PointerEvent;
    Object.defineProperty(globalThis, 'PointerEvent', {
      configurable: true,
      value: undefined
    });

    let move = useMove({
      onMove: (event) => {
        moveEvents.push({type: event.type, x: event.deltaX, y: event.deltaY});
      },
      onMoveEnd: (event) => {
        moveEvents.push({type: event.type});
      },
      onMoveStart: (event) => {
        moveEvents.push({type: event.type});
      }
    });

    let createTouchEvent = (type: string, touches: Array<{identifier: number, pageX: number, pageY: number}>) => {
      let event = new Event(type, {bubbles: true, cancelable: true}) as TouchEvent;
      Object.defineProperty(event, 'changedTouches', {value: touches});
      Object.defineProperty(event, 'altKey', {value: false});
      Object.defineProperty(event, 'ctrlKey', {value: false});
      Object.defineProperty(event, 'metaKey', {value: false});
      Object.defineProperty(event, 'shiftKey', {value: false});
      return event;
    };

    try {
      if (move.moveProps.value.onTouchStart) {
        container.addEventListener('touchstart', move.moveProps.value.onTouchStart as EventListener);
      }
      expect(move.moveProps.value.onPointerDown).toBeUndefined();

      container.dispatchEvent(createTouchEvent('touchstart', [{identifier: 1, pageX: 2, pageY: 4}]));
      window.dispatchEvent(createTouchEvent('touchmove', [{identifier: 1, pageX: 8, pageY: 1}]));
      window.dispatchEvent(createTouchEvent('touchend', [{identifier: 1, pageX: 8, pageY: 1}]));

      expect(moveEvents).toEqual([
        {type: 'movestart'},
        {type: 'move', x: 6, y: -3},
        {type: 'moveend'}
      ]);
    } finally {
      Object.defineProperty(globalThis, 'PointerEvent', {
        configurable: true,
        value: originalPointerEvent
      });
      document.body.removeChild(container);
    }
  });

  it('binds vue-aria move global listeners to the owner window', () => {
    let iframe = document.createElement('iframe');
    document.body.appendChild(iframe);
    let iframeWindow = iframe.contentWindow;
    let iframeDocument = iframeWindow?.document;
    expect(iframeWindow).toBeTruthy();
    expect(iframeDocument).toBeTruthy();
    let container = iframeDocument!.createElement('div');
    iframeDocument!.body.appendChild(container);
    let moveEvents: Array<{type: string, x?: number, y?: number}> = [];

    let move = useMove({
      onMove: (event) => {
        moveEvents.push({type: event.type, x: event.deltaX, y: event.deltaY});
      },
      onMoveEnd: (event) => {
        moveEvents.push({type: event.type});
      },
      onMoveStart: (event) => {
        moveEvents.push({type: event.type});
      }
    });

    let addMainWindowListener = vi.spyOn(window, 'addEventListener');
    let addIframeWindowListener = vi.spyOn(iframeWindow!, 'addEventListener');
    let removeIframeWindowListener = vi.spyOn(iframeWindow!, 'removeEventListener');

    try {
      if (move.moveProps.value.onPointerDown) {
        container.addEventListener('pointerdown', move.moveProps.value.onPointerDown as EventListener);
        container.dispatchEvent(createPointerEvent('pointerdown', {pointerId: 31, pageX: 10, pageY: 10}));
        let iframeListenerTypes = addIframeWindowListener.mock.calls.map(([type]) => type as string);
        let mainWindowListenerTypes = addMainWindowListener.mock.calls.map(([type]) => type as string);
        expect(iframeListenerTypes).toEqual(expect.arrayContaining(['pointermove', 'pointerup', 'pointercancel']));
        expect(mainWindowListenerTypes).not.toContain('pointermove');
        expect(mainWindowListenerTypes).not.toContain('pointerup');
        expect(mainWindowListenerTypes).not.toContain('pointercancel');

        iframeWindow!.dispatchEvent(createPointerEvent('pointermove', {pointerId: 31, pageX: 15, pageY: 8}));
        iframeWindow!.dispatchEvent(createPointerEvent('pointerup', {pointerId: 31, pageX: 15, pageY: 8}));
        expect(moveEvents).toEqual([
          {type: 'movestart'},
          {type: 'move', x: 5, y: -2},
          {type: 'moveend'}
        ]);

        let removedIframeTypes = removeIframeWindowListener.mock.calls.map(([type]) => type as string);
        expect(removedIframeTypes).toEqual(expect.arrayContaining(['pointermove', 'pointerup', 'pointercancel']));
      } else if (move.moveProps.value.onMouseDown) {
        container.addEventListener('mousedown', move.moveProps.value.onMouseDown as EventListener);
        container.dispatchEvent(new MouseEvent('mousedown', {bubbles: true, button: 0, clientX: 10, clientY: 10}));
        let iframeListenerTypes = addIframeWindowListener.mock.calls.map(([type]) => type as string);
        let mainWindowListenerTypes = addMainWindowListener.mock.calls.map(([type]) => type as string);
        expect(iframeListenerTypes).toEqual(expect.arrayContaining(['mousemove', 'mouseup']));
        expect(mainWindowListenerTypes).not.toContain('mousemove');
        expect(mainWindowListenerTypes).not.toContain('mouseup');

        iframeWindow!.dispatchEvent(new MouseEvent('mousemove', {bubbles: true, button: 0, clientX: 15, clientY: 8}));
        iframeWindow!.dispatchEvent(new MouseEvent('mouseup', {bubbles: true, button: 0, clientX: 15, clientY: 8}));
        expect(moveEvents).toEqual([
          {type: 'movestart'},
          {type: 'move', x: 5, y: -2},
          {type: 'moveend'}
        ]);

        let removedIframeTypes = removeIframeWindowListener.mock.calls.map(([type]) => type as string);
        expect(removedIframeTypes).toEqual(expect.arrayContaining(['mousemove', 'mouseup']));
      }
    } finally {
      addMainWindowListener.mockRestore();
      addIframeWindowListener.mockRestore();
      removeIframeWindowListener.mockRestore();
      iframe.remove();
    }
  });

  it('cleans up vue-aria move global listeners when scope is disposed mid-move', () => {
    let container = document.createElement('div');
    document.body.appendChild(container);
    let removeWindowListener = vi.spyOn(window, 'removeEventListener');

    let scope = effectScope();
    let hasPointerDown = false;
    let hasMouseDown = false;
    scope.run(() => {
      let move = useMove();
      if (move.moveProps.value.onPointerDown) {
        container.addEventListener('pointerdown', move.moveProps.value.onPointerDown as EventListener);
        hasPointerDown = true;
      } else if (move.moveProps.value.onMouseDown) {
        container.addEventListener('mousedown', move.moveProps.value.onMouseDown as EventListener);
        hasMouseDown = true;
      }
    });

    try {
      if (hasPointerDown) {
        container.dispatchEvent(createPointerEvent('pointerdown', {pointerId: 42, pageX: 2, pageY: 2}));
      } else if (hasMouseDown) {
        container.dispatchEvent(new MouseEvent('mousedown', {bubbles: true, button: 0, clientX: 2, clientY: 2}));
      }
      scope.stop();
      let removedTypes = removeWindowListener.mock.calls.map(([type]) => type as string);
      if (hasPointerDown) {
        expect(removedTypes).toEqual(expect.arrayContaining(['pointermove', 'pointerup', 'pointercancel']));
      } else if (hasMouseDown) {
        expect(removedTypes).toEqual(expect.arrayContaining(['mousemove', 'mouseup']));
      }
    } finally {
      scope.stop();
      removeWindowListener.mockRestore();
      document.body.removeChild(container);
    }
  });

  it('triggers vue-aria long press callbacks after threshold', () => {
    vi.useFakeTimers();
    let longPressEvents: string[] = [];
    let button = document.createElement('button');
    document.body.append(button);

    let longPress = useLongPress({
      onLongPress: () => {
        longPressEvents.push('press');
      },
      onLongPressEnd: () => {
        longPressEvents.push('end');
      },
      onLongPressStart: () => {
        longPressEvents.push('start');
      },
      threshold: 25
    });

    try {
      if (longPress.longPressProps.value.onPointerDown) {
        button.addEventListener('pointerdown', longPress.longPressProps.value.onPointerDown as EventListener);
      }

      button.dispatchEvent(createPointerEvent('pointerdown', {pointerId: 7, pointerType: 'touch'}));
      vi.advanceTimersByTime(40);
      window.dispatchEvent(createPointerEvent('pointerup', {pointerId: 7, pointerType: 'touch'}));

      expect(longPressEvents).toEqual(['start', 'end', 'press']);
    } finally {
      vi.useRealTimers();
      document.body.removeChild(button);
    }
  });

  it('prevents regular press handlers when vue-aria long press threshold is reached', () => {
    vi.useFakeTimers();
    let longPressEvents: string[] = [];
    let pressEvents: string[] = [];
    let button = document.createElement('button');
    document.body.append(button);

    let longPress = useLongPress({
      onLongPress: () => {
        longPressEvents.push('press');
      },
      onLongPressEnd: () => {
        longPressEvents.push('end');
      },
      onLongPressStart: () => {
        longPressEvents.push('start');
      },
      threshold: 25
    });
    let press = usePress({
      onPress: () => {
        pressEvents.push('press');
      }
    });
    let mergedProps = ariaMergeProps(longPress.longPressProps.value, press.pressProps.value);

    try {
      if (mergedProps.onPointerDown) {
        button.addEventListener('pointerdown', mergedProps.onPointerDown as EventListener);
      }

      button.dispatchEvent(createPointerEvent('pointerdown', {pointerId: 8, pointerType: 'touch'}));
      vi.advanceTimersByTime(30);
      expect(document.activeElement).toBe(button);

      window.dispatchEvent(createPointerEvent('pointerup', {pointerId: 8, pointerType: 'touch'}));
      expect(longPressEvents).toEqual(['start', 'end', 'press']);
      expect(pressEvents).toEqual([]);
    } finally {
      vi.useRealTimers();
      document.body.removeChild(button);
    }
  });

  it('prevents touch context menu during vue-aria long press', () => {
    vi.useFakeTimers();
    let button = document.createElement('button');
    document.body.append(button);

    let longPress = useLongPress({
      onLongPress: () => {},
      threshold: 25
    });

    try {
      if (longPress.longPressProps.value.onPointerDown) {
        button.addEventListener('pointerdown', longPress.longPressProps.value.onPointerDown as EventListener);
      }

      button.dispatchEvent(createPointerEvent('pointerdown', {pointerId: 9, pointerType: 'touch'}));
      vi.advanceTimersByTime(30);

      expect(button.dispatchEvent(new MouseEvent('contextmenu', {bubbles: true, cancelable: true}))).toBe(false);

      window.dispatchEvent(createPointerEvent('pointerup', {pointerId: 9, pointerType: 'touch'}));
      vi.advanceTimersByTime(40);

      expect(button.dispatchEvent(new MouseEvent('contextmenu', {bubbles: true, cancelable: true}))).toBe(true);
    } finally {
      vi.useRealTimers();
      document.body.removeChild(button);
    }
  });

  it('delays vue-aria focusSafely virtual focus and skips disconnected targets', () => {
    vi.useFakeTimers();
    setInteractionModality('virtual');
    let connected = document.createElement('button');
    let detached = document.createElement('button');
    document.body.append(connected, detached);
    let connectedFocus = vi.spyOn(connected, 'focus');
    let detachedFocus = vi.spyOn(detached, 'focus');

    try {
      requestAnimationFrame(() => {
        detached.remove();
      });

      focusSafely(connected);
      focusSafely(detached);
      vi.runAllTimers();

      expect(connectedFocus).toHaveBeenCalledWith({preventScroll: true});
      expect(detachedFocus).toHaveBeenCalledTimes(0);
    } finally {
      vi.useRealTimers();
      connectedFocus.mockRestore();
      detachedFocus.mockRestore();
      connected.remove();
      detached.remove();
    }
  });

  it('restores vue-aria iOS text selection after restore delay', () => {
    vi.useFakeTimers();
    let userAgentSpy = vi.spyOn(window.navigator, 'userAgent', 'get').mockReturnValue('iPhone');
    let platformSpy = vi.spyOn(window.navigator, 'platform', 'get').mockReturnValue('iPhone');
    let previousUserSelect = document.documentElement.style.webkitUserSelect;
    document.documentElement.style.webkitUserSelect = 'contain';

    try {
      disableTextSelection();
      expect(document.documentElement.style.webkitUserSelect).toBe('none');

      restoreTextSelection();
      expect(document.documentElement.style.webkitUserSelect).toBe('none');

      vi.runAllTimers();
      expect(document.documentElement.style.webkitUserSelect).toBe('contain');
    } finally {
      vi.useRealTimers();
      userAgentSpy.mockRestore();
      platformSpy.mockRestore();
      document.documentElement.style.webkitUserSelect = previousUserSelect;
    }
  });

  it('restores vue-aria non-iOS element text selection styles', () => {
    let userAgentSpy = vi.spyOn(window.navigator, 'userAgent', 'get').mockReturnValue('Android');
    let platformSpy = vi.spyOn(window.navigator, 'platform', 'get').mockReturnValue('Linux');
    let target = document.createElement('div');
    target.style.userSelect = 'contain';

    try {
      disableTextSelection(target);
      expect(target.style.userSelect).toBe('none');

      restoreTextSelection(target);
      expect(target.style.userSelect).toBe('contain');
    } finally {
      userAgentSpy.mockRestore();
      platformSpy.mockRestore();
    }
  });

  it('cleans up vue-aria scroll wheel listeners when scope is disposed', () => {
    let target = document.createElement('div');
    document.body.appendChild(target);
    let scrollEvents: number[] = [];
    let scope = effectScope();
    scope.run(() => {
      useScrollWheel(
        {
          onScroll: (event) => {
            scrollEvents.push(event.deltaY);
          }
        },
        ref(target)
      );
    });

    try {
      target.dispatchEvent(new WheelEvent('wheel', {bubbles: true, cancelable: true, deltaY: 3}));
      expect(scrollEvents).toEqual([3]);

      scope.stop();
      target.dispatchEvent(new WheelEvent('wheel', {bubbles: true, cancelable: true, deltaY: 6}));
      expect(scrollEvents).toEqual([3]);
    } finally {
      scope.stop();
      target.remove();
    }
  });

  it('emits close events from dismissable dialog controls', async () => {
    let wrapper = mount(Dialog, {
      props: {
        isDismissable: true,
        open: true,
        title: 'Confirm changes'
      },
      slots: {
        default: 'Body copy'
      }
    });

    await wrapper.get('button.vs-dialog__close').trigger('click');
    expect(wrapper.find('button.vs-dialog-layer__backdrop').exists()).toBe(false);
    expect(wrapper.emitted('close')).toHaveLength(1);
  });

  it('provides dialog container dismiss context to nested content', async () => {
    let DialogDismissControl = defineComponent({
      name: 'DialogDismissControl',
      setup() {
        let container = useDialogContainer();
        return {
          dismiss: container.dismiss,
          type: container.type
        };
      },
      template: '<button type="button" class="dialog-dismiss-control" @click="dismiss">Dismiss {{type}}</button>'
    });

    let wrapper = mount(Dialog, {
      props: {
        open: true,
        type: 'fullscreenTakeover'
      },
      slots: {
        default: () => h(DialogDismissControl)
      }
    });

    expect(wrapper.get('button.dialog-dismiss-control').text()).toContain('fullscreenTakeover');
    await wrapper.get('button.dialog-dismiss-control').trigger('click');
    expect(wrapper.emitted('close')).toHaveLength(1);
  });

  it('emits close from popover backdrop and applies placement class', async () => {
    let wrapper = mount(Popover, {
      props: {
        open: true,
        placement: 'right'
      },
      slots: {
        default: 'Popover content'
      }
    });

    let popover = document.body.querySelector('section.vs-popover');
    expect(popover).not.toBeNull();
    expect(popover?.className).toContain('vs-popover--right');

    let backdrop = document.body.querySelector('button.vs-popover-layer__backdrop');
    expect(backdrop).not.toBeNull();
    backdrop?.dispatchEvent(new MouseEvent('click', {bubbles: true}));
    await nextTick();
    expect(wrapper.emitted('close')).toHaveLength(1);
    wrapper.unmount();
  });

  it('emits open and close lifecycle events from contextual help controls', async () => {
    let wrapper = mount(ContextualHelp, {
      props: {
        modelValue: false,
        title: 'Need help',
        variant: 'info'
      },
      slots: {
        default: 'Additional context'
      }
    });

    await wrapper.get('button.vs-contextual-help__trigger').trigger('click');
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([true]);
    expect(wrapper.emitted('open')).toHaveLength(1);
    expect(wrapper.find('section.vs-contextual-help__dialog').exists()).toBe(true);

    await wrapper.get('button.vs-contextual-help__close').trigger('click');
    expect(wrapper.emitted('update:modelValue')?.[1]).toEqual([false]);
    expect(wrapper.emitted('close')).toHaveLength(1);
  });

  it('emits selection updates from menu item clicks', async () => {
    let wrapper = mount(Menu, {
      props: {
        modelValue: 'Forms',
        selectionMode: 'single',
        label: 'Category',
        items: ['Forms', 'Navigation', 'Overlays']
      }
    });

    await wrapper.findAll('.vs-spectrum-menu__item')[1].trigger('click');
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['Navigation']);
    expect(wrapper.emitted('select')?.[0]).toEqual(['Navigation']);
  });

  it('emits selection updates from list view item clicks', async () => {
    let wrapper = mount(ListView, {
      props: {
        modelValue: 'Vue Spectrum',
        label: 'Library',
        items: ['Vue Spectrum', 'React Spectrum', 'Tailwind CSS']
      }
    });

    await wrapper.findAll('button.vs-listbox__item')[2].trigger('click');
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['Tailwind CSS']);
    expect(wrapper.emitted('select')?.[0]).toEqual(['Tailwind CSS']);
  });

  it('emits set-backed multiple selection updates from list view item clicks', async () => {
    let wrapper = mount(ListView, {
      props: {
        modelValue: new Set(['Vue Spectrum']),
        selectionMode: 'multiple',
        label: 'Library',
        items: ['Vue Spectrum', 'React Spectrum', 'Tailwind CSS']
      }
    });

    await wrapper.findAll('button.vs-listbox__item')[2].trigger('click');
    let emittedModelValue = wrapper.emitted('update:modelValue')?.[0]?.[0] as unknown;
    expect(emittedModelValue).toBeInstanceOf(Set);
    expect(Array.from(emittedModelValue as Set<string>)).toEqual(['Vue Spectrum', 'Tailwind CSS']);
    let emittedSelection = wrapper.emitted('select')?.[0]?.[0] as unknown;
    expect(emittedSelection).toBeInstanceOf(Set);
    expect(Array.from(emittedSelection as Set<string>)).toEqual(['Vue Spectrum', 'Tailwind CSS']);
  });

  it('emits model updates and change events from search autocomplete input', async () => {
    let wrapper = mount(SearchAutocomplete, {
      props: {
        modelValue: '',
        label: 'Language',
        options: ['TypeScript', 'JavaScript', 'Rust']
      }
    });

    await wrapper.get('input').setValue('Rust');
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['Rust']);
    expect(wrapper.emitted('change')?.[0]).toEqual(['Rust']);
    expect(wrapper.findAll('datalist option')).toHaveLength(3);
  });

  it('emits action and clear selection events from action bar controls', async () => {
    let wrapper = mount(ActionBar, {
      props: {
        selectedItemCount: 2,
        items: ['Approve', 'Archive']
      }
    });

    let actionButtons = wrapper.findAll('button.vs-action-group__item');
    expect(actionButtons).toHaveLength(2);
    expect(wrapper.text()).toContain('2 selected');

    await actionButtons[1].trigger('click');
    await wrapper.get('button.vs-action-bar__clear').trigger('click');
    expect(wrapper.emitted('action')?.[0]).toEqual(['Archive']);
    expect(wrapper.emitted('clearSelection')).toHaveLength(1);
  });

  it('skips disabled action bar items from disabledKeys', async () => {
    let wrapper = mount(ActionBar, {
      props: {
        selectedItemCount: 2,
        items: ['Edit', 'Archive'],
        disabledKeys: ['Edit']
      }
    });

    let buttons = wrapper.findAll('button.vs-action-group__item');
    expect(buttons[0].attributes('disabled')).toBeDefined();
    expect(buttons[0].attributes('aria-disabled')).toBe('true');

    await buttons[0].trigger('click');
    expect(wrapper.emitted('action')).toBeUndefined();

    await buttons[1].trigger('click');
    expect(wrapper.emitted('action')?.[0]).toEqual(['Archive']);
  });

  it('emits action and selection updates from action group', async () => {
    let wrapper = mount(ActionGroup, {
      props: {
        modelValue: ['Edit'],
        items: ['Edit', 'Delete'],
        selectionMode: 'multiple'
      }
    });

    await wrapper.findAll('button.vs-action-group__item')[1].trigger('click');
    expect(wrapper.emitted('action')?.[0]).toEqual(['Delete']);
    let emittedSelection = wrapper.emitted('update:modelValue')?.[0]?.[0] as unknown;
    expect(emittedSelection).toBeInstanceOf(Set);
    expect(Array.from(emittedSelection as Set<string>)).toEqual(['Edit', 'Delete']);
  });

  it('emits action when breadcrumb links are activated', async () => {
    let wrapper = mount(Breadcrumbs, {
      props: {
        items: ['Home', 'Migration', 'Starter'],
        current: 'Starter'
      }
    });

    await wrapper.findAll('button.vs-breadcrumbs__link')[0].trigger('click');
    expect(wrapper.emitted('action')?.[0]).toEqual(['Home']);
    expect(wrapper.get('.vs-breadcrumbs__current').text()).toBe('Starter');
  });

  it('propagates disclosure toggles through accordion v-model', async () => {
    let wrapper = mount({
      components: {Accordion, Disclosure, DisclosurePanel, DisclosureTitle},
      data: () => ({expanded: ['foundation']}),
      template: `
        <Accordion v-model="expanded">
          <Disclosure id="foundation">
            <DisclosureTitle>Foundation</DisclosureTitle>
            <DisclosurePanel>Foundational work</DisclosurePanel>
          </Disclosure>
          <Disclosure id="composition">
            <DisclosureTitle>Composition</DisclosureTitle>
            <DisclosurePanel>Composition work</DisclosurePanel>
          </Disclosure>
        </Accordion>
      `
    });

    let panels = wrapper.findAll('.spectrum-Accordion-itemContent');
    expect(panels).toHaveLength(2);
    expect(panels[0].attributes('aria-hidden')).toBe('false');
    expect(panels[1].attributes('aria-hidden')).toBe('true');
    await wrapper.findAll('button.spectrum-Accordion-itemHeader')[0].trigger('click');
    let expandedAfterCollapse = (wrapper.vm as unknown as {expanded: Iterable<string>}).expanded;
    expect(Array.from(expandedAfterCollapse)).toEqual([]);
    await wrapper.findAll('button.spectrum-Accordion-itemHeader')[1].trigger('click');
    let expandedAfterSelect = (wrapper.vm as unknown as {expanded: Iterable<string>}).expanded;
    expect(Array.from(expandedAfterSelect)).toEqual(['composition']);
  });
});
