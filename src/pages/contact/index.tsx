import { useState } from 'react';
import { Col, Form, Row } from 'react-bootstrap';
import { EnvelopeFill, Instagram, TelephoneFill } from 'react-bootstrap-icons';
import isEmail from 'validator/lib/isEmail';
import to from 'await-to-js';

import { Button } from '@/components';
import { useApi } from '@/hooks/useApi';

import './contact.scss';

export const Contact = () => {
  const { post } = useApi();
  const [commissionInfo, setCommissionInfo] = useState({});
  const [status, setStatus] = useState('');

  const isValid = () => {
    return Object.entries(commissionInfo).every(([key, value]: any) => {
      if (key === 'email') {
        return isEmail(value)
      }

      return !!value && value.length > 3
    })
  }

  const submit = async () => {
    const [submitErr] = await to(post('commission/send', {
      commissionInfo: commissionInfo
    }))

    if (submitErr) {
      setStatus('danger')

      setTimeout(() => {
        setStatus('')
      }, 1000)

      return;
    }

    setStatus('success');

    setTimeout(() => {
      setStatus('');

      setCommissionInfo({
        name: '',
        email: '',
        message: '',
      });
    }, 1000);
  }

  return (
    <div className="contact">
      <div className="container--text">
        <h2 className="page-title">Contact</h2>
        <div className="spacer mt-5">
          <div>
            <ul>
              <li><Instagram className="mr-2" /><a href="https://instagram.com/frayamsterdam">@frayamsterdam</a></li>
              <li><TelephoneFill className="mr-2" /><a href="tel:0634042924">0634042924</a></li>
              <li><EnvelopeFill className="mr-2" /><a href="mailto:frayamsterdam@gmail.com">frayamsterdam@gmail.com</a></li>
            </ul>
          </div>

          <div className="hr"></div>

          <div>
            <h4>Blazinbell</h4>
            <ul>
              <li>Czaar Peterstraat 263, 1018 PL Amsterdam</li>
              <li><a href="http://blazinbell.com/">Website</a></li>
            </ul>
          </div>

          <div>
            <h4>Independent outlet</h4>
            <ul>
              <li>Vijzelstraat 77, 1017 HG Amsterdam</li>
              <li><a href="https://skateboardsamsterdam.nl/">Website</a></li>
            </ul>
          </div>

          <div className="hr"></div>

          <h3>Commissions</h3>
          <div className="contact__form">
            <Row>
              <Col cols="6">
                <p>Name</p>
                <Form.Control name="name" onChange={(event) => setCommissionInfo({ ...commissionInfo, name: event.target.value })} />
              </Col>
              <Col cols="6">
                <p>Email</p>
                <Form.Control name="email" onChange={(event) => setCommissionInfo({ ...commissionInfo, email: event.target.value })} />
              </Col>

              <Col cols="12">
                <p>Message</p>
                <Form.Text as="textarea" rows={5} name="message" onChange={(event) => setCommissionInfo({ ...commissionInfo, message: event.target.value })} />
              </Col>
            </Row>
            <Row className="justify-content-end">
              <Col cols="5">
                <Button
                  block
                  type="submit"
                  disabled={!isValid}
                  state={status || 'primary'}
                  className="checkout__submit"
                  onClick={submit}
                >
                  Send
                </Button>
              </Col>
            </Row>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contact;
