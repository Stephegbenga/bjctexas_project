import React, {useEffect, useState} from "react";
import {Form, Input, Select, Button, Col, Row, Switch, message as toast, Spin, Flex} from "antd";
import uuid from "react-uuid";

const {Option} = Select;
const Login = ({logged_in, setLogged_in}) => {
  const [password, setPassword] = useState("");
  const [new_password, setNewpassword] = useState("");
  const [confirm_password, setConfirmpassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [show_reset, setShow_reset] = useState(false);

  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue({
      password,
      new_password,
      confirm_password,
    });
  }, [password, new_password, confirm_password]);

  const update_password = async (payload) => {
    try {
      const response = await fetch("/password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        const errorMessage = errorResponse.message;
        toast.error(errorMessage);
        return
      }

      const data = await response.json();
      return data;
    } catch (error) {
      toast.error("network error:");
      return;
    }
  };



  const click_forgot_password = async () => {
    try {
      const response = await fetch("/forgotpassword", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        const errorMessage = errorResponse.message;
        toast.error(errorMessage);
        return
      }

      const data = await response.json();
      toast.success("Please check your email address for further details")
    } catch (error) {
      toast.error("network error:");
      return;
    }
  };






  const onFinish = async () => {
    if (new_password.trim() !== "" && confirm_password.trim() !== "") {
        if(new_password != confirm_password){
            return toast.error("password must match")
        }
    }
    
    let payload = {password, new_password, show_reset};

    setLoading(true);
    let res = await update_password(payload);

    if (res) {
        if(show_reset){
            setNewpassword("")
            setConfirmpassword("")
            setPassword("")
            toast.success("password updated");
        }else{
            setLoading(false);
            setLogged_in(true)
        }
    }

    setLoading(false);
  };
  
  const reset_email_button_clicked = async () => {
    setShow_reset(!show_reset);
  };



  return (
    <>
      <Row justify="center">
        <h3>{show_reset ? "Rest Password" : "Login"}</h3>
      </Row>
      <Row justify="center" align="top" style={{minHeight: "100vh", marginTop: 30}}>
        <Col span={8}>
          <Form
            form={form}
            onFinish={onFinish}
            labelCol={{span: 8}}
            wrapperCol={{span: "auto"}}
            labelAlign="left"
            initialValues={{
              password,
              new_password,
              confirm_password,
            }}
          >
            <Form.Item label="Password" name="password">
              <Input value={password} type="password" onChange={(e) => setPassword(e.target.value)} />
            </Form.Item>

            {show_reset && (
              <>
                <Form.Item label="New Password" name="new_password">
                  <Input value={new_password} type="password" onChange={(e) => setNewpassword(e.target.value)} />
                </Form.Item>

                <Form.Item label="Confirm Password" name="confirm_password">
                  <Input value={confirm_password} type="password" onChange={(e) => setConfirmpassword(e.target.value)} />
                </Form.Item>
              </>
            )}


            {show_reset ? (
              <Form.Item wrapperCol={{offset: 8, span: 30}}>
                <Col span={30}>
                  <Button loading={loading} type="primary" htmlType="submit">
                    Submit
                  </Button>
                  <Button loading={loading} style={{marginLeft: 8}} onClick={reset_email_button_clicked}>
                    Back to login
                  </Button>
                </Col>
              </Form.Item>
            ) : (
              <Form.Item wrapperCol={{offset: 8, span: 30}}>
                <Col span={30}>
                  <Button loading={loading} type="primary" htmlType="submit">
                    Login
                  </Button>


                  <Button loading={loading} style={{marginLeft: 8}} onClick={reset_email_button_clicked}>
                    Reset password
                  </Button>
                </Col>
              </Form.Item>
            )}
          </Form>

          <Row justify="center">
            <span style={{ marginTop: 8, display: "block", color: "red", cursor: "pointer"}} onClick={click_forgot_password}>
              Forgot Password
            </span>
          </Row>
        </Col>
      </Row>
    </>
  );
};

export default Login;
