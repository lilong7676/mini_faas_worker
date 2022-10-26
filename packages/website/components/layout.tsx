import { Container, Row, Spacer, Col } from '@nextui-org/react';
import { Navbar, Button, Link, Text } from '@nextui-org/react';

export const siteTitle = 'Mini FaaS Worker';

export default function Layout({
  children,
  home,
}: {
  children: React.ReactNode;
  home?: boolean;
}) {
  return (
    <Container
      className="layout-container"
      display="flex"
      direction="column"
      css={{
        height: '100vh',
        width: '100%',
      }}
    >
      <Navbar height={'76px'} isBordered>
        <Navbar.Brand>
          <Text b color="inherit">
            Mini FaaS Worker
          </Text>
        </Navbar.Brand>
        <Navbar.Content>
          <Navbar.Link isActive href="#">
            Workers
          </Navbar.Link>
          <Navbar.Link href="#">others</Navbar.Link>
          <Navbar.Link href="#">others</Navbar.Link>
          <Navbar.Link href="#">others</Navbar.Link>
        </Navbar.Content>
        <Navbar.Content>
          <Navbar.Link color="inherit" href="#">
            登录
          </Navbar.Link>
          <Navbar.Item>
            <Button auto flat as={Link} href="#">
              注册
            </Button>
          </Navbar.Item>
        </Navbar.Content>
      </Navbar>
      <Container
        display="flex"
        css={{ height: 'calc(100vh - 76px)', flexDirection: 'column' }}
      >
        {children}
      </Container>
    </Container>
  );
}
