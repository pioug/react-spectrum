import '@adobe/spectrum-css-temp/components/icon/vars.css';
import '@adobe/spectrum-css-temp/components/icon/workflow-icons.css';
import {classNames} from '@vue-spectrum/utils';
import {computed, defineComponent, h, type PropType} from 'vue';
const styles: {[key: string]: string} = {};

type IconScaleSize = 'L' | 'M';
export type WorkflowIconSize = 'XXL' | 'XXS' | 'XL' | 'XS' | 'L' | 'M' | 'S' | 'l' | 'm' | 's' | 'xl' | 'xs' | 'xxl' | 'xxs';
const iconColorTokens = new Set(['negative', 'notice', 'positive', 'informative']);

interface SvgAttributes {
  [name: string]: string
}

function resolveSize(size: WorkflowIconSize | undefined): {scale: IconScaleSize, token: Exclude<WorkflowIconSize, 'l' | 'm' | 's' | 'xl' | 'xs' | 'xxl' | 'xxs'>} {
  if (!size) {
    return {
      scale: 'M',
      token: 'M'
    };
  }

  let normalized = size.toUpperCase() as Exclude<WorkflowIconSize, 'l' | 'm' | 's' | 'xl' | 'xs' | 'xxl' | 'xxs'>;
  let scale: IconScaleSize = normalized === 'L' || normalized === 'XL' || normalized === 'XXL' ? 'L' : 'M';
  return {
    scale,
    token: normalized
  };
}

function resolveAriaHidden(hasLabel: boolean, hidden: boolean, explicitAriaHidden: unknown): string | undefined {
  if (hidden) {
    return 'true';
  }

  if (typeof explicitAriaHidden === 'string') {
    return explicitAriaHidden;
  }

  if (typeof explicitAriaHidden === 'boolean') {
    return explicitAriaHidden ? 'true' : 'false';
  }

  return hasLabel ? undefined : 'true';
}

function resolveIconColor(color: string): string {
  if (iconColorTokens.has(color)) {
    return `var(--spectrum-semantic-${color}-color-icon)`;
  }

  return color;
}

export function createWorkflowIcon(componentName: string, svgAttributes: SvgAttributes, svgInnerHTML: string) {
  return defineComponent({
    name: componentName,
    inheritAttrs: false,
    props: {
      color: {
        type: String,
        default: 'currentColor'
      },
      hidden: {
        type: Boolean,
        default: false
      },
      label: {
        type: String,
        default: ''
      },
      size: {
        type: String as PropType<WorkflowIconSize | undefined>,
        default: undefined
      }
    },
    setup(props, {attrs}) {
      let resolvedSize = computed(() => resolveSize(props.size));

      return () => {
        let ariaLabel = props.label || attrs['aria-label'];
        let ariaLabelledby = attrs['aria-labelledby'];
        let hasLabel = !!ariaLabel || !!ariaLabelledby;
        let ariaHidden = resolveAriaHidden(hasLabel, props.hidden, attrs['aria-hidden']);

        return h('svg', {
          ...svgAttributes,
          ...attrs,
          class: [
            classNames(styles, 'spectrum-Icon', `spectrum-Icon--size${resolvedSize.value.token}`),
            'vs-workflow-icon',
            attrs.class
          ],
          style: [
            {color: resolveIconColor(props.color)},
            attrs.style
          ],
          role: 'img',
          focusable: 'false',
          hidden: props.hidden || undefined,
          'aria-label': typeof ariaLabel === 'string' ? ariaLabel : undefined,
          'aria-labelledby': typeof ariaLabelledby === 'string' ? ariaLabelledby : undefined,
          'aria-hidden': ariaHidden,
          'data-scale': resolvedSize.value.scale,
          'data-vac': '',
          innerHTML: svgInnerHTML
        });
      };
    }
  });
}

export type WorkflowIconProps = {
  color?: string,
  hidden?: boolean,
  label?: string,
  size?: WorkflowIconSize,
  [key: string]: unknown
};
