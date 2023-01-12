/*
 * 简易封装 monaco-editor
 * @Author: lilonglong
 * @Date: 2023-01-12 23:19:58
 * @Last Modified by: lilonglong
 * @Last Modified time: 2023-01-12 15:25:59
 */
import Editor from '@monaco-editor/react';
import { loader } from '@monaco-editor/react';
const loaderConfig = {
  paths: {
    // 临时解决默认使用 jsdeliver cdn 访问缓慢的问题
    vs: '/monaco-editor/min/vs',
  },
};
loader.config(loaderConfig);

export type { editor } from 'monaco-editor';
export default Editor;
