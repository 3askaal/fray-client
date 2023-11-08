import { useState } from 'react';
import { Col, Form, Row, Stack } from 'react-bootstrap';
import { EnvelopeFill, Instagram, TelephoneFill } from 'react-bootstrap-icons';
import isEmail from 'validator/lib/isEmail';
import to from 'await-to-js';

import { Button } from '@/components';
import { useApi } from '@/hooks/useApi';

import './contact.scss';
import { HeadExtend } from '@/components/Head';

export const Contact = () => {
  const { post } = useApi();
  const [commissionInfo, setCommissionInfo] = useState<any>({});
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

    console.log('submitErr: ', submitErr);

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
    <>
      <HeadExtend title="Contact" />
      <div className="contact">
        <div className="container--text">
          <h2 className="page-title">Contact</h2>
          <div className="spacer mt-5">
            <div>
              <ul>
                <li>
                  <Stack direction="horizontal" gap={2}>
                    <Instagram />
                    <a href="https://instagram.com/frayamsterdam">@frayamsterdam</a>
                  </Stack>
                </li>
                <li>
                  <Stack direction="horizontal" gap={2}>
                    <TelephoneFill />
                    <a href="tel:0634042924">0634042924</a>
                  </Stack>
                </li>
                <li>
                  <Stack direction="horizontal" gap={2}>
                    <EnvelopeFill />
                    <a href="mailto:frayamsterdam@gmail.com">frayamsterdam@gmail.com</a>
                  </Stack>
                </li>
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
                <Col xs={6}>
                  <p>Name</p>
                  <Form.Control
                    name="name"
                    onChange={(event) => setCommissionInfo({ ...commissionInfo, name: event.target.value })}
                    value={commissionInfo.name}
                  />
                </Col>
                <Col xs={6}>
                  <p>Email</p>
                  <Form.Control
                    name="email"
                    onChange={(event) => setCommissionInfo({ ...commissionInfo, email: event.target.value })}
                    value={commissionInfo.email}
                  />
                </Col>
                <Col xs={12}>
                  <p>Message</p>
                  <Form.Control
                    as="textarea"
                    rows={5} name="message"
                    onChange={(event) => setCommissionInfo({ ...commissionInfo, message: event.target.value })}
                    value={commissionInfo.message}
                  />
                </Col>
              </Row>
              <Row className="justify-content-end">
                <Col xs="5">
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
    </>
  )
}

export default Contact;
