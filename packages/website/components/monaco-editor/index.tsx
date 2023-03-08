/*
 * 简易封装 monaco-editor
 * @Author: lilonglong
 * @Date: 2023-01-12 23:19:58
 * @Last Modified by: lilonglong
 * @Last Modified time: 2023-03-08 17:24:18
 */
import Editor from '@monaco-editor/react';
import { loader } from '@monaco-editor/react';

const IS_DEV = process.env.NODE_ENV === 'development';

const loaderConfig = {
  paths: {
    // 临时解决默认使用 jsdeliver cdn 访问缓慢的问题
    vs: IS_DEV
      ? '/monaco-editor/min/vs'
      : 'https://lilong7676.cn/mini_faas_worker/monaco-editor/min/vs',
  },
};
loader.config(loaderConfig);

export type { editor } from 'monaco-editor';
export default Editor;
