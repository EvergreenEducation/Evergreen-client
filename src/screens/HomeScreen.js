import React from 'react';
import { Layout, Row, Col, Button } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignInAlt } from '@fortawesome/free-solid-svg-icons';
import { GlobalProvider } from 'store/GlobalStore';
import { TopicCarouselContainer } from 'components/student';
import { Route, withRouter } from 'react-router-dom';
import { imported } from 'react-imported-component/macro';
import 'scss/screens/home-screen.scss';

const { Header, Content } = Layout;

const OfferInfoContainer = imported(() =>
  import('components/student/OfferInfoContainer')
);

const ProviderInfoContainer = imported(() =>
  import('components/student/ProviderInfoContainer')
);

const PathwayInfoContainer = imported(() =>
  import('components/student/PathwayInfoContainer')
);

function HomeScreen() {
  return (
    <GlobalProvider>
      <Layout className="h-full bg-gray-100">
        <div className="w-full bg-gray-100" style={{ paddingBottom: 48 }}>
          <Content className="mx-auto max-w-4xl h-auto bg-gray-100">
            <Route exact path="/">
              <TopicCarouselContainer />
            </Route>
            <Route exact path="/offer/:id" component={OfferInfoContainer} />
            <Route
              exact
              path="/provider/:id"
              component={ProviderInfoContainer}
            />
            <Route exact path="/pathway/:id" component={PathwayInfoContainer} />
          </Content>
        </div>
        <Header className="h-12 w-full bg-green-500 fixed bottom-0 z-10">
          <Row className="mx-auto max-w-4xl h-full">
            <Col
              className="flex justify-start items-center h-full"
              span={12}
            ></Col>
            <Col className="flex justify-end items-center h-full" span={12}>
              <Button
                type="primary"
                shape="circle"
                onClick={() => {
                  window.location.replace(
                    `${process.env.REACT_APP_API_URL}/login`
                  );
                }}
              >
                <FontAwesomeIcon className="text-white" icon={faSignInAlt} />
              </Button>
            </Col>
          </Row>
        </Header>
      </Layout>
    </GlobalProvider>
  );
}

export default withRouter(HomeScreen);
