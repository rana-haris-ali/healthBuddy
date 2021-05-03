import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const Footer = () => {
  return (
    <footer>
      <Container className='text-center py-3'>
        <Row>
          <Col>Copyright &copy; HealthBuddy</Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
