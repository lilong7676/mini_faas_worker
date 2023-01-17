import { useState, useEffect, useRef, useCallback } from 'react';
import { NextPage } from 'next';
import Link from 'next/link';
import { Row, Text, Button, Loading } from '@nextui-org/react';
import { notification } from 'antd';
import { useRequest } from 'ahooks';
import { Deployment, Func } from '@mini_faas_worker/types';
import { Container, Section, Bar } from 'react-simple-resizer';

import Layout from 'components/layout';
import { Tabs } from 'components/tabs';
import Editor, { editor } from 'components/monaco-editor';
import HttpTriggerRunner from 'components/workers/detail/playground/HttpTriggerRunner';
import Preview from 'components/workers/detail/playground/Preview';
import Devtools from 'components/devtools';
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

  const [disableDevtoolsInteraction, setDisableDevtoolsInteraction] =
    useState(false);

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
  }, [currentDeployment, getDeploymentCode]);

  const onChange = (key: string) => {
    console.log(key);
  };

  const containerStyle = {
    height: '100%',
    width: '100%',
  };

  const resizerBarStyle = {
    backgroundColor: 'rgb(182, 182, 182)',
    cursor: 'col-resize',
    marginLeft: '5px',
    marginRight: '5px',
  };

  const onDevtoolsResizerStatusChange = useCallback(isActive => {
    setDisableDevtoolsInteraction(isActive);
  }, []);

  return (
    <Layout>
      <Container style={containerStyle}>
        <Section minSize={100}>
          <Link href={`/workers/detail/${encodeURIComponent(id)}`}>
            <Row align="center">
              <Text color="primary" css={{ cursor: 'pointer' }}>
                &#8592;{name}&nbsp;
              </Text>
              <Text>{'/ development'}</Text>
            </Row>
          </Link>

          <div style={{ width: '100%', height: '100%' }}>
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
          </div>

          <div className="footer">
            <Text size="$sm">
              上次部署时间:&nbsp;&nbsp;
              {finalDeployment ? finalDeployment.updatedAt : '还未部署'}
            </Text>
            <Button
              size={'xs'}
              disabled={saving}
              onPress={() => saveAndDeploy(id, editorRef.current.getValue())}
            >
              {saving ? (
                <Loading color="currentColor" size="sm" />
              ) : (
                '保存并部署'
              )}
            </Button>
          </div>
        </Section>

        <Bar size={1} style={resizerBarStyle} />

        <Section>
          <Container vertical={true} style={{ height: '100%', width: '100%' }}>
            <Section>
              <Tabs
                style={{ width: '100%', height: '100%', overflow: 'hidden' }}
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
            </Section>

            <Bar
              size={1}
              style={{
                backgroundColor: 'rgb(182, 182, 182)',
              }}
              onStatusChanged={onDevtoolsResizerStatusChange}
            />

            <Section
              minSize={100}
              defaultSize={200}
              style={{ overflow: 'initial' }}
            >
              <Devtools disableInteraction={disableDevtoolsInteraction} />
            </Section>
          </Container>
        </Section>
      </Container>
    </Layout>
  );
};

WorkerPlayground.getInitialProps = async ({ query }) => {
  const funcId = query.id as string;
  const funcDetail = await getFunctionDetail(funcId);
  return { funcDetail };
};

export default WorkerPlayground;
