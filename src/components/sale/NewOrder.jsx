import {
  Form,
  Input,
  InputNumber,
  Popconfirm,
  Table,
  Tooltip,
  Typography
} from "antd";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  onDeleteItemInCart,
  onEditItemInOrder
} from "../../store/slices/orderSlice";
import { Grid } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { apiBase } from "../api/Api";
import { onEditItemIncartRef } from "../../store/slices/cartRefSlice";

const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode = inputType === "number" ? <InputNumber /> : <Input />;
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0
          }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`
            }
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};
//component
const NewOrder = () => {
  const { order } = useSelector((state) => state.order);
  const { cartRef } = useSelector((state) => state.cartRef);
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState("");

  const inventoryQuery = useQuery({
    queryKey: [["inventoryList"]],
    queryFn: () => apiBase.get("/item/inventory")
  });
  const handleDelete = (key) => {
    const newData = order?.filter((article) => article._id !== key._id);
    dispatch(onDeleteItemInCart(newData));
  };

  const isEditing = (record) => record._id === editingKey;
  const edit = (record) => {
    form.setFieldsValue({
      initalValue: "",
      ...record
    });
    setEditingKey(record._id);
  };
  const cancel = () => {
    setEditingKey("");
  };
  const save = async (key) => {
    try {
      const row = await form.validateFields();
      const newData = [...order];
      const newDataCart = [...cartRef];
      const quantityRef = await inventoryQuery?.data?.data?.inventory?.find(
        (item) => item._id === key._id
      );
      if (parseInt(row.initialValue) > quantityRef.quantity) {
        return alert("Cantidad superior a inventario");
      }
      const index = await order?.findIndex((item) => item._id === key._id);
      const indexCart = await cartRef?.findIndex(
        (item) => item._id === key._id
      );
      if (index > -1 && indexCart > -1) {
        const item = newData[index];
        const itemCart = newDataCart[indexCart];
        newData.splice(index, 1, {
          ...item,
          ...row
        });
        newDataCart.splice(indexCart, 1, {
          ...itemCart,
          ...row
        });
        dispatch(onEditItemInOrder(newData));
        dispatch(onEditItemIncartRef(newDataCart));

        setEditingKey("");
      } else {
        newData.push(row);
        setEditingKey("");
      }
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      width: "20%"

      //   ...getColumnSearchProps("name")
    },
    {
      title: "Marca",
      dataIndex: "brand",
      width: "12%"

      //   ...getColumnSearchProps("brand")
    },
    {
      title: "Color",
      dataIndex: "color",
      width: "10%",

      //   ...getColumnSearchProps("color"),
      sorter: (a, b) => a.color.length - b.color.length,
      sortDirections: ["descend", "ascend"]
    },
    {
      title: "Descripcion",
      dataIndex: "resume",
      key: "resume",
      width: "30%",

      //   ...getColumnSearchProps("resume"),
      sorter: (a, b) => a.resume.length - b.resume.length,
      sortDirections: ["descend", "ascend"],
      ellipsis: {
        showTitle: false
      },
      render: (resume) => (
        <Tooltip placement="topLeft" title={resume}>
          {resume}
        </Tooltip>
      )
    },
    {
      title: "Tamano",
      dataIndex: "size",
      width: "6%",

      //   ...getColumnSearchProps("size"),
      sorter: (a, b) => a.size.length - b.size.length,
      sortDirections: ["descend", "ascend"]
    },
    {
      title: "Cantidad",
      dataIndex: "initialValue",
      width: "6%",
      editable: true,
      //   ...getColumnSearchProps("initialValue"),
      sorter: (a, b) => a.initialValue.length - b.initialValue.length,
      sortDirections: ["descend", "ascend"]
    },
    {
      title: "Precio/Unidad",
      dataIndex: "price",
      width: "6%",
      //   ...getColumnSearchProps("price"),
      sorter: (a, b) => a.price.length - b.price.length,
      sortDirections: ["descend", "ascend"]
    },
    {
      title: "operation",
      dataIndex: "operation",
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Typography
              onClick={() => save(record)}
              style={{
                marginRight: 8
              }}
            >
              Guardar
            </Typography>
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <p>Cancel</p>
            </Popconfirm>
          </span>
        ) : (
          <>
            <Typography
              style={{ marginRight: "1rem" }}
              disabled={editingKey !== ""}
              onClick={() => edit(record)}
            >
              Editar Cant
            </Typography>
            <Typography disabled={editingKey !== ""}>
              <Popconfirm
                title="Sure to cancel?"
                onConfirm={() => handleDelete(record)}
              >
                Borrar
              </Popconfirm>
            </Typography>
          </>
        );
      }
    }
  ];

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: col.dataIndex === "quantity" ? "number" : "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record)
      })
    };
  });
  return (
    <Grid item sx={12}>
      <Form form={form} component={false}>
        <Table
          components={{
            body: {
              cell: EditableCell
            }
          }}
          bordered
          dataSource={order}
          columns={mergedColumns}
          rowClassName="editable-row"
          pagination={{
            onChange: cancel
          }}
        />
      </Form>
    </Grid>
  );
};
export default NewOrder;
