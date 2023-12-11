

import React, { useEffect, useState } from 'react';
import { Form, Input, Select, Button, Col, Row, Switch, message as toast } from 'antd';

const { Option } = Select;
const App = () => {
  const [email, setEmail] = useState("");
  const [unit, setUnit] = useState("min");
  const [value, setValue] = useState(10);
  const [max_email, setMax_email] = useState(10);
  const [forwarding, setForwarding] = useState(false);
  const [loading, setLoading] = useState(false)

  const [form] = Form.useForm(); 


  
  useEffect(() => {

    const onLoad = async () => {
      try {
        const response = await fetch('/settings'); // Replace with your endpoint
        if (!response.ok) {
          toast.error('Network response was not ok');
        }

        const res = await response.json();
        let {email, max_email, unit, value, forwarding} = res.data
        setEmail(email)
        setMax_email(max_email)
        setForwarding(forwarding)
        setValue(value)
        setUnit(unit)
      } catch (error) {
        toast.error('Error fetching settings:');
      } finally {
      }

    }

    onLoad()

  }, [])




  useEffect(() => {
    form.setFieldsValue({
      email,
      maxEmails: max_email,
      maxEmailsTimeUnit: { unit, value },
      forwarding,
    });
  }, [email, max_email, unit, value, forwarding, form]);

  

  const onFinish = async () => {
    let payload = { email, max_email, unit, value, forwarding };
  
    try {
      setLoading(true);
  
      const response = await fetch('/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // You may need to include additional headers based on your server requirements
        },
        body: JSON.stringify(payload),
      });
  
      if (!response.ok) {
        toast.error('Network response was not ok');
        return;
      }
  
      const data = await response.json();
      // Handle the response data as needed
      toast.success('Settings updated successfully:');
    } catch (error) {
      toast.error('Error updating settings:');
    } finally {
      setLoading(false);
    }
  };



  return (
    <Form
      form={form}
      style={{ width: "auto", padding: 40 }}
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      onFinish={onFinish}
      labelAlign="top"
      initialValues={{
        email,
        maxEmails: max_email,
        maxEmailsTimeUnit: { unit, value },
        forwarding,
      }}
    >
      <Form.Item label="Receiving Email" name="email">
        <Input style={{ width: "530px" }} value={email} onChange={(e) => setEmail(e.target.value)} />
      </Form.Item>

      <Form.Item label="Max Emails" name="maxEmails">
        <Input
          type="number"
          style={{ width: "530px" }}
          value={max_email}
          onChange={(e) => setMax_email(e.target.value)}
          min={1}
        />
      </Form.Item>

      <Form.Item label="Every" name="maxEmailsTimeUnit">
        <Row gutter={8}>
          <Col span={8}>
            <Form.Item name={['maxEmailsTimeUnit', 'value']} noStyle>
              <Input value={value} type="number" min={1} onChange={(e) => setValue(e.target.value)} />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name={['maxEmailsTimeUnit', 'unit']} noStyle>
              <Select value={unit} onChange={(value) => setUnit(value)}>
                <Option value="min">Minutes</Option>
                <Option value="hour">Hours</Option>
                <Option value="day">Days</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </Form.Item>

      <Form.Item label="Forwarding" name="forwarding">
        <Switch checked={forwarding} onChange={(checked) => setForwarding(checked)} />
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Col offset={8} span={16}>
          <Button loading={loading} type="primary" htmlType="submit">
            Save
          </Button>
        </Col>
      </Form.Item>
    </Form>
  );
};

export default App;