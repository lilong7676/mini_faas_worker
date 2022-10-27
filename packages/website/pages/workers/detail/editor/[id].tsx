import { useRef } from 'react';
import { NextPage } from 'next';
import Link from 'next/link';
import {
  Row,
  Col,
  Spacer,
  Card,
  Text,
  Button,
  gray,
  Loading,
} from '@nextui-org/react';
import { notification } from 'antd';
import Editor from '@monaco-editor/react';
import { useRequest } from 'ahooks';
import { Func } from '@mini_faas_worker/types';

import Layout from 'components/layout';
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
  await postFormData('/saveAndDeployFunction', body);

  notification.success({
    message: '部署成功',
  });
}

const WorkerEditor: NextPage<Props> = ({ funcDetail }) => {
  const { id, name, deployments, domains } = funcDetail;

  const editorRef = useRef(null);

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

  const currentDeployment = deployments[0] || newDeployment;

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
        <Row css={{ flexGrow: 1 }}>
          <Editor
            defaultLanguage="javascript"
            defaultValue={`// worker
`}
            onMount={handleEditorDidMount}
            className="worker-editor-monaco"
          />
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
            {currentDeployment ? currentDeployment.updatedAt : '还未部署'}
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

WorkerEditor.getInitialProps = async ({ query }) => {
  const funcId = query.id as string;
  const funcDetail = await getFunctionDetail(funcId);
  return { funcDetail };
};

export default WorkerEditor;
