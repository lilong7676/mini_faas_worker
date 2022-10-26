import React, { useCallback, useRef, useState } from 'react';
import {
  Container,
  Row,
  Col,
  Input,
  Button,
  Spacer,
  Loading,
} from '@nextui-org/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from 'components/layout';
import { postData } from 'libs/fetchData';

export default function WorkerCreator() {
  const workerNameRef = useRef('');

  const router = useRouter();

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    workerNameRef.current = e.target.value;
  }, []);

  const [creating, setCreating] = useState(false);
  const handleCreateBtnClicked = useCallback(() => {
    setCreating(true);
    postData('/createFunction', { name: workerNameRef.current })
      .then(resp => {
        console.log('resp', resp);
        router.replace('/');
      })
      .catch(e => {
        console.error(e);
      })
      .finally(() => {
        setCreating(false);
      });
  }, [workerNameRef]);

  return (
    <Layout>
      <Container
        display="flex"
        className="creator-container"
        css={{ height: '100%', flexDirection: 'column' }}
      >
        <Spacer></Spacer>
        <Col>
          <Link href="/">&#8592;Workers</Link>
          <Row>
            <Input
              width={'20rem'}
              label="函数名"
              placeholder="输入函数名"
              onChange={handleChange}
            />
          </Row>
          <Spacer y={8}></Spacer>
        </Col>
        <Row css={{ flexGrow: '1' }}></Row>
        <Row>
          <Spacer x={10}></Spacer>
          <Button
            auto
            css={{
              backgroundColor: 'rgb(217, 217, 217)',
              color: '#333',
              marginRight: '1rem',
            }}
          >
            取消
          </Button>
          <Button disabled={creating} auto onPress={handleCreateBtnClicked}>
            {creating ? <Loading color="currentColor" size="sm" /> : '创建'}
          </Button>
        </Row>
        <Spacer y={10}></Spacer>
      </Container>
    </Layout>
  );
}
