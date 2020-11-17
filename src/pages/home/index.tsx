import React from 'react'
import { Modal, Form, Button, Row, Col, TreeSelect } from 'antd'

const { TreeNode } = TreeSelect

const AddAndUpdateModal: React.FC<{}> = () => {
  const [form] = Form.useForm()

  return (
    <Modal
      title={`清除测试`}
      visible
      footer={ null }
      forceRender
      maskClosable={ false }
      onCancel={ () => {
        form.resetFields()
      }}
    >
      <Form
        form={ form }
        labelCol={{
          span: 6
        }}
      >
        <Row gutter={24}>
          <Col span={ 24 }>
            <Form.Item label='菜单权限' name='resourceList'>
              <TreeSelect placeholder="请选择该角色所能显示的菜单" treeCheckable treeDefaultExpandAll>
                <TreeNode value="parent 1-0" title="parent 1-0">
                  <TreeNode value="leaf1" title="my leaf" />
                  <TreeNode value="leaf2" title="your leaf" />
                </TreeNode>
              </TreeSelect>
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={24} style={{ textAlign: 'right' }}>
            <Button htmlType="reset" onClick={ () => form.resetFields() }>重置</Button>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
}

export default AddAndUpdateModal
