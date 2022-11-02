import { useEffect, useRef } from 'react';
import { NextPage } from 'next';
import Link from 'next/link';
import { Row, Col, Text, Button, Loading } from '@nextui-org/react';
import { notification } from 'antd';
import Editor from '@monaco-editor/react';
import type { editor } from 'monaco-editor';
import { useRequest } from 'ahooks';
import { Deployment, Func } from '@mini_faas_worker/types';
import { Tabs } from 'antd';

import Layout from 'components/layout';
import HttpTriggerRunner from 'components/workers/detail/playground/HttpTriggerRunner';
import Preview from 'components/workers/detail/playground/Preview';
import { getData, postFormData } from 'libs/fetchData';

interface Props {
  funcDetail: Func;
}

async function getFunctionDetail(funcId: string) {
  return getData('/functionDetail', { id: funcId });
}

async function saveAndDeployFunction(funcId: string, code: string) {
  const body = new FormData();
  const blob = new Blob([code], { type: 'text/plain' });
  body.append('code', blob, 'index.js');
  body.append('funcId', funcId);
  const result = await postFormData('/saveAndDeployFunction', body);

  notification.success({
    message: '部署成功',
  });
  return result;
}

const defaultCode = `
// worker
export async function handler(request) {
  return {hello: 'world'};
}
`;

const WorkerPlayground: NextPage<Props> = ({ funcDetail }) => {
  const { id, name, deployments, domains } = funcDetail;
  const currentDeployment = deployments[0];

  const editorRef = useRef<editor.IStandaloneCodeEditor>(null);

  function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor;
  }

  const {
    data: newDeployment,
    loading: saving,
    run: saveAndDeploy,
  } = useRequest(saveAndDeployFunction, {
    manual: true,
  });

  const finalDeployment =
    (newDeployment as unknown as Deployment) || currentDeployment;

  const {
    data: deploymentCodeData,
    loading: loadingCode,
    run: getDeploymentCode,
  } = useRequest(
    (deploymentId: string) => {
      return getData('/getDeploymentCode', { deploymentId });
    },
    { manual: true }
  );

  const code = deploymentCodeData ? (deploymentCodeData.code as string) : '';

  useEffect(() => {
    if (currentDeployment) {
      getDeploymentCode(currentDeployment.id);
    }
  }, [currentDeployment]);

  const onChange = (key: string) => {
    console.log(key);
  };

  return (
    <Layout>
      <Col
        className="worker-editor"
        css={{ height: '100%', display: 'flex', flexDirection: 'column' }}
      >
        <Row>
          <Link href={`/workers/detail/${encodeURIComponent(id)}`}>
            <Row align="center">
              <Text color="primary" css={{ cursor: 'pointer' }}>
                &#8592;{name}&nbsp;
              </Text>
              <Text>{'/ development'}</Text>
            </Row>
          </Link>
        </Row>
        <Row css={{ flexGrow: 1, overflow: 'hidden' }}>
          <Row justify="center" css={{ height: '100%' }}>
            <section style={{ width: '50%', height: '100%' }}>
              {loadingCode ? (
                <Loading>加载代码中...</Loading>
              ) : (
                <Editor
                  defaultLanguage="javascript"
                  defaultValue={defaultCode}
                  value={code}
                  onMount={handleEditorDidMount}
                  className="worker-editor-monaco"
                />
              )}
            </section>
            <Col css={{ height: '100%', width: '50%', overflowY: 'auto' }}>
              <Tabs
                style={{ width: '100%', height: '100%' }}
                defaultActiveKey="1"
                onChange={onChange}
                items={[
                  {
                    label: `HTTP`,
                    key: '1',
                    children: (
                      <HttpTriggerRunner deployment={finalDeployment} />
                    ),
                  },
                  {
                    label: `预览`,
                    key: '2',
                    children: <Preview deployment={finalDeployment} />,
                  },
                ]}
              />
            </Col>
          </Row>
        </Row>

        <Row
          justify="space-between"
          css={{
            backgroundColor: 'rgb(242, 242, 242)',
            borderTop: '1px solid rgb(182, 182, 182)',
            padding: '$4',
          }}
        >
          <Text size="$sm">
            上次部署时间:&nbsp;&nbsp;
            {finalDeployment ? finalDeployment.updatedAt : '还未部署'}
          </Text>
          <Button
            size={'xs'}
            disabled={saving}
            onPress={() => saveAndDeploy(id, editorRef.current.getValue())}
          >
            {saving ? <Loading color="currentColor" size="sm" /> : '保存并部署'}
          </Button>
        </Row>
      </Col>
    </Layout>
  );
};

WorkerPlayground.getInitialProps = async ({ query }) => {
  const funcId = query.id as string;
  const funcDetail = await getFunctionDetail(funcId);
  return { funcDetail };
};

export default WorkerPlayground;
