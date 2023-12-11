import React, {useEffect, useState} from "react";
import {Form, Input, Select, Button, Col, Row, Switch, message as toast, Spin, Flex} from "antd";
import uuid from "react-uuid";


const {Option} = Select;
const App = () => {
  const [email, setEmail] = useState("");
  const [unit, setUnit] = useState("min");
  const [value, setValue] = useState(10);
  const [max_email, setMax_email] = useState(10);
  const [forwarding, setForwarding] = useState(false);
  const [loading, setLoading] = useState(false);
  const [main_loading, setMain_loading] = useState(false);

  const [form] = Form.useForm();

  useEffect(() => {
    const onLoad = async () => {
      try {
        setMain_loading(true);
        const response = await fetch("/settings"); // Replace with your endpoint
        if (!response.ok) {
          toast.error("Network response was not ok");
        }

        const res = await response.json();
        let {email, max_email, unit, value, forwarding} = res.data;
        setEmail(email);
        setMax_email(max_email);
        setForwarding(forwarding);
        setValue(value);
        setUnit(unit);
      } catch (error) {
        toast.error("Error fetching settings:");
      } finally {
      }
      setMain_loading(false);
    };

    onLoad();
  }, []);

  useEffect(() => {
    form.setFieldsValue({
      email,
      maxEmails: max_email,
      maxEmailsTimeUnit: {unit, value},
      forwarding,
    });
  }, [email, max_email, unit, value, forwarding, form]);



  const update_setting = async (payload) => {    
    try {

      const response = await fetch("/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // You may need to include additional headers based on your server requirements
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        toast.error("Network response was not ok");
        return
      }

      const data = await response.json();
      return data
    } catch (error) {
      toast.error("Error updating settings:");
      return
    } 
  }



  const onFinish = async () => {
    let payload = {email, max_email, unit, value, forwarding};
    setLoading(true)
    let res = await update_setting(payload)

    if(res){
      toast.success("settings updated")
    }
    setLoading(false)
  };



  const reset_email_queue = async () => {
    let payload = {email, max_email, unit, value, forwarding, reset: uuid()};
    setLoading(true)
    let res = await update_setting(payload)

    if(res){
      toast.success("email queue reset")
    }

    setLoading(false)
  }

  if (main_loading) {
    return (
      <div
        style={{
          width: "100%",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "none",
        }}
      >
        <Spin tip="Loading" size="large">
        </Spin>
      </div>
    );
  }

  return (
    <Row justify="center" align="top" style={{ minHeight: "100vh", marginTop: 70 }}>
      <Col span={8}>
        <Form
          form={form}
          onFinish={onFinish}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          labelAlign="left"
          initialValues={{
            email,
            maxEmails: max_email,
            maxEmailsTimeUnit: { unit, value },
            forwarding,
          }}
        >
          <Form.Item label="Receiving Email" name="email">
            <Input value={email} onChange={(e) => setEmail(e.target.value)} />
          </Form.Item>

          <Form.Item label="Max Emails" name="maxEmails">
            <Input type="number" value={max_email} onChange={(e) => setMax_email(e.target.value)} min={1} />
          </Form.Item>

          <Form.Item label="Frequency" name="maxEmailsTimeUnit">
            <Row gutter={8}>
              <Col span={6}>
                <Form.Item name={["maxEmailsTimeUnit", "value"]} noStyle>
                  <Input value={value} type="number" min={1} onChange={(e) => setValue(e.target.value)} />
                </Form.Item>
              </Col>
              <Col span={10}>
                <Form.Item name={["maxEmailsTimeUnit", "unit"]} noStyle>
                  <Select value={unit} onChange={(value) => setUnit(value)}>
                  <Option value="sec">Seconds</Option>
                    <Option value="min">Minutes</Option>
                    <Option value="hour">Hours</Option>
                    <Option value="day">Days</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          </Form.Item>

          <Form.Item label="Forwarding" name="forwarding" valuePropName="checked">
            <Switch onChange={(checked) => setForwarding(checked)} />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 8, span: 30 }}>
            <Col span={30}>
              <Button loading={loading} type="primary" htmlType="submit">
                Save
              </Button>
              <Button loading={loading} style={{ marginLeft: 8 }} onClick={reset_email_queue}>
                Reset email queue
              </Button>
            </Col>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  );
};

export default App;