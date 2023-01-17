/*
 * Tabs 组件
 * @Author: lilonglong
 * @Date: 2023-01-17 23:03:07
 * @Last Modified by: lilonglong
 * @Last Modified time: 2023-01-17 15:31:02
 */

import { Tabs as AntdTabs, TabsProps } from 'antd';
import cz from 'classnames';
import S from './index.module.scss';

export function Tabs(props: TabsProps) {
  const { className, ...otherProps } = props;
  const newClassName = cz(className, S.lllTabs);
  return <AntdTabs className={newClassName} {...otherProps}></AntdTabs>;
}
