import React from 'react';
import {Button} from '@react-spectrum/button';
import {ButtonGroup} from '@react-spectrum/buttongroup';
import {Provider} from '@react-spectrum/provider';
import {theme as defaultTheme} from '@react-spectrum/theme-default';
import {Cell, Column, Row, TableBody, TableHeader, TableView} from '@react-spectrum/table';
import {Tabs} from '@react-spectrum/tabs';
import {Text} from '@react-spectrum/text';
import {TextField} from '@react-spectrum/textfield';
import {Item} from '@react-stately/collections';

export function ParityRtlFixture() {
  return (
    <Provider theme={defaultTheme} locale="ar-EG" colorScheme="light" scale="medium" UNSAFE_className="fixture-root">
      <section data-parity-id="rtl-cluster" className="fixture-card">
        <Text>واجهة RTL</Text>
        <ButtonGroup>
          <Button variant="cta">حفظ</Button>
          <Button variant="secondary">إلغاء</Button>
        </ButtonGroup>
        <TextField label="المالك" defaultValue="أفري" />
        <Tabs aria-label="علامات التبويب" defaultSelectedKey="overview">
          <Item key="overview" title="نظرة عامة">محتوى النظرة العامة</Item>
          <Item key="details" title="تفاصيل">محتوى التفاصيل</Item>
        </Tabs>
        <TableView aria-label="تذاكر" selectionMode="single" defaultSelectedKeys={['T-100']}>
          <TableHeader>
            <Column key="ticket">التذكرة</Column>
            <Column key="owner">المالك</Column>
          </TableHeader>
          <TableBody>
            <Row key="T-100"><Cell>T-100</Cell><Cell>أفري</Cell></Row>
            <Row key="T-101"><Cell>T-101</Cell><Cell>كوين</Cell></Row>
          </TableBody>
        </TableView>
      </section>
    </Provider>
  );
}
