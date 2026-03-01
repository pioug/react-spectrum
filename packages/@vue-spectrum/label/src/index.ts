import '@adobe/spectrum-css-temp/components/fieldlabel/vars.css';
import '@adobe/spectrum-css-temp/components/helptext/vars.css';
import {useFormProps} from '@vue-spectrum/form';
import {useProviderProps} from '@vue-spectrum/provider';
import {classNames, filterDOMProps, useId} from '@vue-spectrum/utils';
import {cloneVNode, computed, defineComponent, h, isVNode, type PropType, type VNode, type VNodeChild} from 'vue';
const fieldLabelStyles: {[key: string]: string} = {};
const helpTextStyles: {[key: string]: string} = {};


type LabelAlign = 'end' | 'start' | null;
type LabelPosition = 'side' | 'top';
type NecessityIndicator = 'icon' | 'label' | null;

const ALERT_MEDIUM_PATH = 'M8.564 1.289.2 16.256A.5.5 0 0 0 .636 17h16.728a.5.5 0 0 0 .436-.744L9.436 1.289a.5.5 0 0 0-.872 0zM10 14.75a.25.25 0 0 1-.25.25h-1.5a.25.25 0 0 1-.25-.25v-1.5a.25.25 0 0 1 .25-.25h1.5a.25.25 0 0 1 .25.25zm0-3a.25.25 0 0 1-.25.25h-1.5a.25.25 0 0 1-.25-.25v-6a.25.25 0 0 1 .25-.25h1.5a.25.25 0 0 1 .25.25z';
const ASTERISK_PATH = 'M6.573 6.558c.056.055.092.13 0 .204l-1.148.74c-.093.056-.13.02-.167-.073L3.832 4.947l-1.87 2.055c-.02.037-.075.074-.13 0l-.889-.926c-.092-.055-.074-.111 0-.167l2.111-1.76-2.408-.906c-.037 0-.092-.074-.055-.167l.63-1.259a.097.097 0 0 1 .166-.036l2.111 1.37.13-2.704a.097.097 0 0 1 .111-.11L5.277.54c.092 0 .11.037.092.13l-.722 2.647 2.444-.74c.056-.038.111-.038.148.073l.241 1.37c.019.093 0 .13-.074.13l-2.556.204z';

function toObject(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' ? value as Record<string, unknown> : {};
}

function cloneFieldChild(children: VNode[]): VNode[] {
  let nextChildren = [...children];
  for (let index = 0; index < nextChildren.length; index++) {
    let child = nextChildren[index];
    if (!isVNode(child)) {
      continue;
    }

    let childProps = toObject(child.props);
    nextChildren[index] = cloneVNode(child, {
      class: [
        classNames(fieldLabelStyles, 'spectrum-Field-field'),
        childProps.className,
        childProps.class
      ]
    });
    break;
  }

  return nextChildren;
}

function renderAlertIcon(className: string): VNode {
  return h('svg', {
    class: className,
    focusable: 'false',
    'aria-hidden': 'true',
    role: 'img',
    viewBox: '0 0 18 18'
  }, [
    h('path', {d: ALERT_MEDIUM_PATH})
  ]);
}

function renderAsteriskIcon(className: string, includeInLabel: boolean): VNode {
  return h('svg', {
    class: className,
    focusable: 'false',
    role: 'img',
    'aria-hidden': includeInLabel ? undefined : 'true',
    'aria-label': includeInLabel ? '(required)' : undefined,
    viewBox: '0 0 8 8'
  }, [
    h('path', {d: ASTERISK_PATH})
  ]);
}

export const Label = defineComponent({
  name: 'VueLabel',
  inheritAttrs: false,
  props: {
    elementType: {
      type: String,
      default: 'label'
    },
    for: {
      type: String,
      default: undefined
    },
    forId: {
      type: String,
      default: ''
    },
    UNSAFE_className: {
      type: String as PropType<string | undefined>,
      default: undefined
    },
    UNSAFE_style: {
      type: Object as PropType<Record<string, unknown> | undefined>,
      default: undefined
    },
    htmlFor: {
      type: String,
      default: undefined
    },
    includeNecessityIndicatorInAccessibilityName: {
      type: Boolean,
      default: false
    },
    isRequired: {
      type: Boolean as PropType<boolean | undefined>,
      default: undefined
    },
    labelAlign: {
      type: String as PropType<LabelAlign>,
      default: undefined
    },
    labelPosition: {
      type: String as PropType<LabelPosition>,
      default: 'top'
    },
    necessityIndicator: {
      type: String as PropType<NecessityIndicator>,
      default: undefined
    },
    required: {
      type: Boolean,
      default: false
    },
    width: {
      type: String as PropType<string | undefined>,
      default: undefined
    }
  },
  setup(props, {slots, attrs}) {
    let providerProps = useProviderProps(props);
    let resolvedProps = computed(() => Object.assign({}, props, providerProps));
    let requiredSource = computed<boolean | undefined>(() => {
      if (resolvedProps.value.isRequired !== undefined) {
        return resolvedProps.value.isRequired;
      }

      if (props.required) {
        return true;
      }

      return undefined;
    });

    let resolvedIsRequired = computed(() => requiredSource.value ?? false);
    let resolvedLabelAlign = computed<LabelAlign>(() => props.labelAlign ?? (props.labelPosition === 'side' ? 'start' : null));
    let resolvedNecessityIndicator = computed<NecessityIndicator>(() => {
      if (props.necessityIndicator !== undefined && props.necessityIndicator !== null) {
        return props.necessityIndicator;
      }

      return requiredSource.value != null ? 'icon' : null;
    });

    let className = computed(() => classNames(
      fieldLabelStyles,
      'spectrum-FieldLabel',
      {
        'spectrum-FieldLabel--positionSide': props.labelPosition === 'side',
        'spectrum-FieldLabel--alignEnd': resolvedLabelAlign.value === 'end'
      },
      props.UNSAFE_className
    ));

    return () => {
      let domProps = filterDOMProps(attrs as Record<string, unknown>) as Record<string, unknown>;
      let {class: domClass, className: domClassName, style: domStyle, ...otherDomProps} = domProps;
      let tag = props.elementType || 'label';
      let htmlFor = props.for || props.htmlFor || props.forId || undefined;
      let necessityLabel = resolvedIsRequired.value ? '(required)' : '(optional)';
      let showNecessityLabel = resolvedNecessityIndicator.value === 'label';
      let showNecessityIcon = resolvedNecessityIndicator.value === 'icon' && resolvedIsRequired.value;
      let children: Array<VNodeChild> = slots.default ? [...slots.default()] : ['Label'];

      if (showNecessityLabel || showNecessityIcon) {
        children.push(' \u200b');
      }

      if (showNecessityLabel) {
        children.push(h('span', {
          'aria-hidden': (!props.includeNecessityIndicatorInAccessibilityName && resolvedIsRequired.value) ? 'true' : undefined
        }, necessityLabel));
      }

      if (showNecessityIcon) {
        children.push(renderAsteriskIcon(
          classNames(
            fieldLabelStyles,
            'spectrum-Icon',
            'spectrum-UIIcon-Asterisk',
            'spectrum-FieldLabel-requiredIcon'
          ),
          props.includeNecessityIndicatorInAccessibilityName
        ));
      }

      return h(tag, {
        ...otherDomProps,
        class: [className.value, domClassName, domClass],
        for: tag === 'label' ? htmlFor : undefined,
        style: [
          props.UNSAFE_style,
          domStyle,
          props.width ? {width: props.width} : undefined
        ]
      }, children);
    };
  }
});

export const VueLabel = Label;

export const HelpText = defineComponent({
  name: 'VueHelpText',
  inheritAttrs: false,
  props: {
    description: {
      type: String as PropType<string | undefined>,
      default: undefined
    },
    errorMessage: {
      type: [String, Number, Object, Function, Array] as PropType<unknown>,
      default: undefined
    },
    descriptionProps: {
      type: Object as PropType<Record<string, unknown> | undefined>,
      default: undefined
    },
    errorMessageProps: {
      type: Object as PropType<Record<string, unknown> | undefined>,
      default: undefined
    },
    validationState: {
      type: String as PropType<'valid' | 'invalid' | undefined>,
      default: undefined
    },
    isInvalid: {
      type: Boolean,
      default: false
    },
    isDisabled: {
      type: Boolean,
      default: false
    },
    showErrorIcon: {
      type: Boolean,
      default: false
    },
    UNSAFE_className: {
      type: String as PropType<string | undefined>,
      default: undefined
    },
    UNSAFE_style: {
      type: Object as PropType<Record<string, unknown> | undefined>,
      default: undefined
    }
  },
  setup(props, {attrs}) {
    return () => {
      let domProps = filterDOMProps(attrs as Record<string, unknown>) as Record<string, unknown>;
      let {class: domClass, className: domClassName, style: domStyle, ...otherDomProps} = domProps;
      let isErrorMessage = !!props.errorMessage && (props.isInvalid || props.validationState === 'invalid');
      let content = isErrorMessage ? props.errorMessage : props.description;

      return h('div', {
        ...otherDomProps,
        class: classNames(
          helpTextStyles,
          'spectrum-HelpText',
          `spectrum-HelpText--${isErrorMessage ? 'negative' : 'neutral'}`,
          {
            'is-disabled': props.isDisabled
          },
          props.UNSAFE_className,
          domClassName,
          domClass
        ),
        style: [props.UNSAFE_style, domStyle]
      }, [
        isErrorMessage && props.showErrorIcon
          ? renderAlertIcon(classNames(helpTextStyles, 'spectrum-Icon', 'spectrum-UIIcon-AlertMedium', 'spectrum-HelpText-validationIcon'))
          : null,
        h('div', {
          ...(isErrorMessage ? toObject(props.errorMessageProps) : toObject(props.descriptionProps)),
          class: classNames(helpTextStyles, 'spectrum-HelpText-text')
        }, content as never)
      ]);
    };
  }
});

export const Field = defineComponent({
  name: 'VueField',
  inheritAttrs: false,
  props: {
    label: {
      type: String as PropType<string | undefined>,
      default: undefined
    },
    description: {
      type: String as PropType<string | undefined>,
      default: undefined
    },
    errorMessage: {
      type: [String, Number, Object, Function, Array] as PropType<unknown>,
      default: undefined
    },
    validationState: {
      type: String as PropType<'valid' | 'invalid' | undefined>,
      default: undefined
    },
    isInvalid: {
      type: Boolean,
      default: false
    },
    isDisabled: {
      type: Boolean,
      default: false
    },
    showErrorIcon: {
      type: Boolean,
      default: false
    },
    isRequired: {
      type: Boolean as PropType<boolean | undefined>,
      default: undefined
    },
    labelPosition: {
      type: String as PropType<LabelPosition | undefined>,
      default: undefined
    },
    labelAlign: {
      type: String as PropType<LabelAlign | undefined>,
      default: undefined
    },
    necessityIndicator: {
      type: String as PropType<NecessityIndicator | undefined>,
      default: undefined
    },
    includeNecessityIndicatorInAccessibilityName: {
      type: Boolean,
      default: false
    },
    contextualHelp: {
      type: [String, Number, Object, Function, Array] as PropType<unknown>,
      default: undefined
    },
    labelProps: {
      type: Object as PropType<Record<string, unknown> | undefined>,
      default: undefined
    },
    descriptionProps: {
      type: Object as PropType<Record<string, unknown> | undefined>,
      default: undefined
    },
    errorMessageProps: {
      type: Object as PropType<Record<string, unknown> | undefined>,
      default: undefined
    },
    elementType: {
      type: String as PropType<string | undefined>,
      default: undefined
    },
    wrapperClassName: {
      type: String as PropType<string | undefined>,
      default: undefined
    },
    wrapperProps: {
      type: Object as PropType<Record<string, unknown> | undefined>,
      default: undefined
    },
    validationErrors: {
      type: Array as PropType<string[] | undefined>,
      default: undefined
    },
    validationDetails: {
      type: Object as PropType<ValidityState | undefined>,
      default: undefined
    },
    UNSAFE_className: {
      type: String as PropType<string | undefined>,
      default: undefined
    },
    UNSAFE_style: {
      type: Object as PropType<Record<string, unknown> | undefined>,
      default: undefined
    }
  },
  setup(props, {attrs, slots}) {
    let contextualHelpId = useId();
    let fallbackLabelPropsId = useId();
    let inForm = computed(() => useFormProps(props) !== props);
    let resolvedProps = computed(() => {
      return useFormProps(useProviderProps(props));
    });
    let computedErrorMessage = computed(() => {
      let errorMessage = resolvedProps.value.errorMessage;
      if (typeof errorMessage === 'function') {
        if (resolvedProps.value.validationErrors != null && resolvedProps.value.validationDetails != null) {
          return errorMessage({
            isInvalid: !!resolvedProps.value.isInvalid,
            validationErrors: resolvedProps.value.validationErrors,
            validationDetails: resolvedProps.value.validationDetails
          });
        }

        return null;
      }

      return errorMessage;
    });
    let showErrorMessage = computed(() => !!computedErrorMessage.value && (resolvedProps.value.isInvalid || resolvedProps.value.validationState === 'invalid'));
    let hasHelpText = computed(() => !!resolvedProps.value.description || showErrorMessage.value);

    return () => {
      let domProps = filterDOMProps(attrs as Record<string, unknown>, {labelable: true}) as Record<string, unknown>;
      let wrapperProps = toObject(resolvedProps.value.wrapperProps);
      let {class: wrapperClass, className: wrapperClassName, style: wrapperStyle, ...otherWrapperProps} = wrapperProps;
      let {class: domClass, className: domClassName, style: domStyle, ...otherDomProps} = domProps;
      let contextualHelp = slots.contextualHelp ? slots.contextualHelp() : (resolvedProps.value.contextualHelp as VNodeChild[] | undefined);
      let contextualHelpNodes = Array.isArray(contextualHelp)
        ? contextualHelp
        : contextualHelp != null
          ? [contextualHelp as VNodeChild]
          : [];
      let labelProps = {
        ...toObject(resolvedProps.value.labelProps)
      } as Record<string, unknown>;

      if (resolvedProps.value.label && contextualHelpNodes.length > 0 && !labelProps.id) {
        labelProps.id = fallbackLabelPropsId;
      }

      let contextualHelpLabelledBy = labelProps.id ? `${labelProps.id} ${contextualHelpId}` : undefined;
      let contextualHelpContent = contextualHelpNodes.map((node, index) => {
        if (!isVNode(node)) {
          return node;
        }

        if (index !== 0) {
          return node;
        }

        let nodeProps = toObject(node.props);
        return cloneVNode(node, {
          class: [classNames(fieldLabelStyles, 'spectrum-Field-contextualHelp'), nodeProps.className, nodeProps.class],
          id: contextualHelpId,
          'aria-labelledby': contextualHelpLabelledBy
        });
      });

      let children = slots.default ? cloneFieldChild(slots.default() as VNode[]) : [];
      let helpText = hasHelpText.value
        ? h(HelpText, {
          descriptionProps: resolvedProps.value.descriptionProps,
          errorMessageProps: resolvedProps.value.errorMessageProps,
          description: resolvedProps.value.description,
          errorMessage: computedErrorMessage.value,
          validationState: resolvedProps.value.validationState,
          isInvalid: resolvedProps.value.isInvalid,
          isDisabled: resolvedProps.value.isDisabled,
          showErrorIcon: resolvedProps.value.showErrorIcon,
          UNSAFE_style: {
            gridArea: 'helpText'
          }
        })
        : null;

      let renderedChildren = resolvedProps.value.labelPosition === 'side'
        ? h('div', {
          class: classNames(fieldLabelStyles, 'spectrum-Field-wrapper')
        }, [
          ...children,
          helpText
        ])
        : [
          ...children,
          helpText
        ];

      let labelAndContextualHelp: VNodeChild = [
        resolvedProps.value.label
          ? h(Label, {
            ...labelProps,
            labelPosition: resolvedProps.value.labelPosition,
            labelAlign: resolvedProps.value.labelAlign,
            isRequired: resolvedProps.value.isRequired,
            necessityIndicator: resolvedProps.value.necessityIndicator,
            includeNecessityIndicatorInAccessibilityName: resolvedProps.value.includeNecessityIndicatorInAccessibilityName,
            elementType: resolvedProps.value.elementType
          }, () => resolvedProps.value.label as VNodeChild)
          : null,
        resolvedProps.value.label && contextualHelpContent.length > 0
          ? contextualHelpContent
          : null
      ];

      if (inForm.value && resolvedProps.value.labelPosition === 'side' && resolvedProps.value.label && contextualHelpContent.length > 0) {
        labelAndContextualHelp = h('div', {
          class: classNames(fieldLabelStyles, 'spectrum-Field-labelCell')
        }, [
          h('div', {
            class: classNames(fieldLabelStyles, 'spectrum-Field-labelWrapper')
          }, labelAndContextualHelp as never)
        ]);
      }

      return h('div', {
        ...otherDomProps,
        ...otherWrapperProps,
        class: classNames(
          fieldLabelStyles,
          'spectrum-Field',
          {
            'spectrum-Field--positionTop': resolvedProps.value.labelPosition !== 'side',
            'spectrum-Field--positionSide': resolvedProps.value.labelPosition === 'side',
            'spectrum-Field--alignEnd': resolvedProps.value.labelAlign === 'end',
            'spectrum-Field--hasContextualHelp': contextualHelpContent.length > 0
          },
          resolvedProps.value.UNSAFE_className,
          domClassName,
          domClass,
          wrapperClassName,
          wrapperClass,
          resolvedProps.value.wrapperClassName
        ),
        style: [
          resolvedProps.value.UNSAFE_style,
          domStyle,
          wrapperStyle
        ]
      }, [
        labelAndContextualHelp as never,
        renderedChildren as never
      ]);
    };
  }
});
