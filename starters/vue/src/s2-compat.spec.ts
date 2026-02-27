import {describe, expect, it} from 'vitest';
import {
  Accordion as S2Accordion,
  ActionBar as S2ActionBar,
  ActionGroup as S2ActionGroup,
  ActionMenu as S2ActionMenu,
  AlertDialog as S2AlertDialog,
  Autocomplete as S2Autocomplete,
  Avatar as S2Avatar,
  Badge as S2Badge,
  Breadcrumbs as S2Breadcrumbs,
  Button as S2Button,
  ButtonGroup as S2ButtonGroup,
  Calendar as S2Calendar,
  Card as S2Card,
  ComboBox as S2ComboBox,
  ContextualHelp as S2ContextualHelp,
  DateField as S2DateField,
  DatePicker as S2DatePicker,
  DateRangePicker as S2DateRangePicker,
  DialogContainer as S2DialogContainer,
  DialogTrigger as S2DialogTrigger,
  Divider as S2Divider,
  DropZone as S2DropZone,
  FileTrigger as S2FileTrigger,
  Form as S2Form,
  Image as S2Image,
  InlineAlert as S2InlineAlert,
  Link as S2Link,
  Menu as S2Menu,
  MenuTrigger as S2MenuTrigger,
  Meter as S2Meter,
  NumberField as S2NumberField,
  Picker as S2Picker,
  ProgressBar as S2ProgressBar,
  ProgressCircle as S2ProgressCircle,
  RadioGroup as S2RadioGroup,
  RangeCalendar as S2RangeCalendar,
  RangeSlider as S2RangeSlider,
  SearchField as S2SearchField,
  Slider as S2Slider,
  StatusLight as S2StatusLight,
  Switch as S2Switch,
  TabList as S2TabList,
  Tabs as S2Tabs,
  TagGroup as S2TagGroup,
  Text as S2Text,
  TextArea as S2TextArea,
  TimeField as S2TimeField,
  ToastContainer as S2ToastContainer,
  ToastQueue as S2ToastQueue,
  Tooltip as S2Tooltip,
  TooltipTrigger as S2TooltipTrigger,
  TreeView as S2TreeView,
  TreeViewItem as S2TreeViewItem,
  TreeViewItemContent as S2TreeViewItemContent
} from '@vue-spectrum/s2';
import {Accordion} from '@vue-spectrum/accordion';
import {ActionBar} from '@vue-spectrum/actionbar';
import {ActionGroup} from '@vue-spectrum/actiongroup';
import {Button} from '@vue-spectrum/button';
import {ButtonGroup} from '@vue-spectrum/buttongroup';
import {Calendar, RangeCalendar} from '@vue-spectrum/calendar';
import {Card} from '@vue-spectrum/card';
import {ComboBox} from '@vue-spectrum/combobox';
import {ContextualHelp} from '@vue-spectrum/contextualhelp';
import {DateField, DatePicker, DateRangePicker, TimeField} from '@vue-spectrum/datepicker';
import {AlertDialog, DialogContainer, DialogTrigger} from '@vue-spectrum/dialog';
import {Divider} from '@vue-spectrum/divider';
import {DropZone} from '@vue-spectrum/dropzone';
import {FileTrigger} from '@vue-spectrum/filetrigger';
import {Form} from '@vue-spectrum/form';
import {Image} from '@vue-spectrum/image';
import {InlineAlert} from '@vue-spectrum/inlinealert';
import {Link} from '@vue-spectrum/link';
import {ActionMenu, Menu, MenuTrigger} from '@vue-spectrum/menu';
import {Meter} from '@vue-spectrum/meter';
import {NumberField} from '@vue-spectrum/numberfield';
import {Picker} from '@vue-spectrum/picker';
import {ProgressBar, ProgressCircle} from '@vue-spectrum/progress';
import {RadioGroup} from '@vue-spectrum/radio';
import {Breadcrumbs} from '@vue-spectrum/breadcrumbs';
import {Avatar} from '@vue-spectrum/avatar';
import {Badge} from '@vue-spectrum/badge';
import {Autocomplete} from '@vue-spectrum/autocomplete';
import {RangeSlider, Slider} from '@vue-spectrum/slider';
import {SearchField} from '@vue-spectrum/searchfield';
import {StatusLight} from '@vue-spectrum/statuslight';
import {Switch} from '@vue-spectrum/switch';
import {Tabs, TabList} from '@vue-spectrum/tabs';
import {TagGroup} from '@vue-spectrum/tag';
import {Text} from '@vue-spectrum/text';
import {TextArea} from '@vue-spectrum/textfield';
import {ToastContainer, ToastQueue} from '@vue-spectrum/toast';
import {Tooltip, TooltipTrigger} from '@vue-spectrum/tooltip';
import {TreeView, TreeViewItem, TreeViewItemContent} from '@vue-spectrum/tree';

describe('S2 compatibility surface', () => {
  let assertSame = (actual: unknown, expected: unknown) => {
    expect(Object.is(actual, expected)).toBe(true);
  };

  it('re-exports real Vue Spectrum primitives for migrated components', () => {
    assertSame(S2Accordion, Accordion);
    assertSame(S2ActionBar, ActionBar);
    assertSame(S2ActionGroup, ActionGroup);
    assertSame(S2ActionMenu, ActionMenu);
    assertSame(S2AlertDialog, AlertDialog);
    assertSame(S2Autocomplete, Autocomplete);
    assertSame(S2Avatar, Avatar);
    assertSame(S2Badge, Badge);
    assertSame(S2Breadcrumbs, Breadcrumbs);
    assertSame(S2Button, Button);
    assertSame(S2ButtonGroup, ButtonGroup);
    assertSame(S2Calendar, Calendar);
    assertSame(S2Card, Card);
    assertSame(S2ComboBox, ComboBox);
    assertSame(S2ContextualHelp, ContextualHelp);
    assertSame(S2DateField, DateField);
    assertSame(S2DatePicker, DatePicker);
    assertSame(S2DateRangePicker, DateRangePicker);
    assertSame(S2DialogContainer, DialogContainer);
    assertSame(S2DialogTrigger, DialogTrigger);
    assertSame(S2Divider, Divider);
    assertSame(S2DropZone, DropZone);
    assertSame(S2FileTrigger, FileTrigger);
    assertSame(S2Form, Form);
    assertSame(S2Image, Image);
    assertSame(S2InlineAlert, InlineAlert);
    assertSame(S2Link, Link);
    assertSame(S2Menu, Menu);
    assertSame(S2MenuTrigger, MenuTrigger);
    assertSame(S2Meter, Meter);
    assertSame(S2NumberField, NumberField);
    assertSame(S2Picker, Picker);
    assertSame(S2ProgressBar, ProgressBar);
    assertSame(S2ProgressCircle, ProgressCircle);
    assertSame(S2RadioGroup, RadioGroup);
    assertSame(S2RangeCalendar, RangeCalendar);
    assertSame(S2RangeSlider, RangeSlider);
    assertSame(S2SearchField, SearchField);
    assertSame(S2Slider, Slider);
    assertSame(S2StatusLight, StatusLight);
    assertSame(S2Switch, Switch);
    assertSame(S2TabList, TabList);
    assertSame(S2Tabs, Tabs);
    assertSame(S2TagGroup, TagGroup);
    assertSame(S2Text, Text);
    assertSame(S2TextArea, TextArea);
    assertSame(S2TimeField, TimeField);
    assertSame(S2ToastContainer, ToastContainer);
    assertSame(S2ToastQueue, ToastQueue);
    assertSame(S2Tooltip, Tooltip);
    assertSame(S2TooltipTrigger, TooltipTrigger);
    assertSame(S2TreeView, TreeView);
    assertSame(S2TreeViewItem, TreeViewItem);
    assertSame(S2TreeViewItemContent, TreeViewItemContent);
  });
});
