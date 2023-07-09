import { SearchOutlined } from "@ant-design/icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Button,
  Form,
  Input,
  InputNumber,
  Popconfirm,
  Space,
  Table,
  Tooltip,
  Typography
} from "antd";
import { useRef, useState } from "react";
import Highlighter from "react-highlight-words";
import { apiBase } from "../api/Api";
import { useSelector } from "react-redux";
import {
  FormControl,
  Grid,
  InputAdornment,
  OutlinedInput
} from "@mui/material";
import { useForm } from "react-hook-form";
import { Icon } from "@iconify/react";

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
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

const ItemInTableInStock = ({ newItem, setNewItem }) => {
  const { adminUser } = useSelector((state) => state.admin);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);
  const { role } = adminUser;
  const { register, setValue, watch } = useForm();
  const inventoryQuery = useQuery({
    queryKey: ["inventory"],
    queryFn: () => apiBase.get("/item/inventory"),
    cacheTime: 0
  });

  const queryClient = useQueryClient();

  const updateItemInStockMutation = useMutation({
    mutationFn: (newData) =>
      apiBase.put(`/item/edit-item-quantity/${newData._id}`, newData),
      onSuccess: () => queryClient.invalidateQueries(["inventory"])
  });

  const deleteItemInStockMutation = useMutation({
    mutationFn: (record) => apiBase.delete(`/item/delete-item/${record._id}`),
    onSuccess: () => queryClient.invalidateQueries(["inventory"])
  });
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState("");
  const [setData] = useState(inventoryQuery.data?.data?.inventory);
  if (inventoryQuery.isLoading) return <p>Cargando inventario...</p>;
  if (inventoryQuery.data) {
    const handleDelete = (key) => {
      deleteItemInStockMutation.mutate(key);
    };

    const isEditing = (record) => record?._id === editingKey;

    const edit = (record) => {
      form.setFieldsValue({
        brand: "",
        color: "",
        name: "",
        resume: "",
        size: "",
        quantity: "",
        cost: "",
        price: "",
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
        const newData = [...inventoryQuery.data.data.inventory];
        const index = newData?.findIndex((item) => item._id === key._id);

        if (index > -1) {
          let newDataTemplate = {
            ...key,
            ...row
          };
          updateItemInStockMutation.mutate(newDataTemplate);
          setEditingKey("");

        } else {
          setData(newData);
          setEditingKey("");
        }
      } catch (errInfo) {
        console.log("Validate Failed:", errInfo);
      }
    };
    const handleSearch = (selectedKeys, confirm, dataIndex) => {
      confirm();
      setSearchText(selectedKeys[0]);
      setSearchedColumn(dataIndex);
    };
    const handleReset = (clearFilters) => {
      clearFilters();
      setSearchText("");
    };
    const getColumnSearchProps = (dataIndex) => ({
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
        close
      }) => (
        <div
          style={{
            padding: 8
          }}
          onKeyDown={(e) => e.stopPropagation()}
        >
          <Input
            ref={searchInput}
            placeholder={`Search ${dataIndex}`}
            value={selectedKeys[0]}
            onChange={(e) =>
              setSelectedKeys(e.target.value ? [e.target.value] : [])
            }
            onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
            style={{
              marginBottom: 8,
              display: "block"
            }}
          />
          <Space>
            <Button
              type="primary"
              onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
              icon={<SearchOutlined />}
              size="small"
              style={{
                width: 90
              }}
            >
              Search
            </Button>
            <Button
              onClick={() => clearFilters && handleReset(clearFilters)}
              size="small"
              style={{
                width: 90
              }}
            >
              Reset
            </Button>
            <Button
              type="link"
              size="small"
              onClick={() => {
                confirm({
                  closeDropdown: false
                });
                setSearchText(selectedKeys[0]);
                setSearchedColumn(dataIndex);
              }}
            >
              Filter
            </Button>
            <Button
              type="link"
              size="small"
              onClick={() => {
                close();
              }}
            >
              close
            </Button>
          </Space>
        </div>
      ),
      filterIcon: (filtered) => (
        <SearchOutlined
          style={{
            color: filtered ? "#1677ff" : undefined
          }}
        />
      ),
      onFilter: (value, record) =>
        record[dataIndex]
          .toString()
          .toLowerCase()
          .includes(value.toLowerCase()),
      onFilterDropdownOpenChange: (visible) => {
        if (visible) {
          setTimeout(() => searchInput.current?.select(), 100);
        }
      },
      render: (text) =>
        searchedColumn === dataIndex ? (
          <Highlighter
            highlightStyle={{
              backgroundColor: "#ffc069",
              padding: 0
            }}
            searchWords={[searchText]}
            autoEscape
            textToHighlight={text ? text.toString() : ""}
          />
        ) : (
          text
        )
    });
    const columns = [
      {
        title: "Producto",
        dataIndex: "name",
        key: "name",
        width: "12%",
        ...getColumnSearchProps("name"),
        sorter: (a, b) => a.name.length - b.name.length,
        editable: role === "Administrador" && true,
        typeof: String
      },
      {
        title: "Marca",
        dataIndex: "brand",
        key: "brand",
        width: "8%",
        ...getColumnSearchProps("brand"),
        editable: role === "Administrador" && true,
        typeof: String
      },
      {
        title: "Color",
        dataIndex: "color",
        key: "color",
        width: "8%",
        ...getColumnSearchProps("color"),
        sorter: (a, b) => a.color.length - b.color.length,
        sortDirections: ["descend", "ascend"],
        editable: role === "Administrador" && true,
        typeof: String
      },
      {
        title: "Tamano",
        dataIndex: "size",
        key: "size",
        width: "6%",
        ...getColumnSearchProps("size"),
        sorter: (a, b) => a.size - b.size,
        sortDirections: ["descend", "ascend"],
        editable: role === "Administrador" && true,
        typeof: Number
      },
      {
        title: "Descripcion",
        dataIndex: "resume",
        key: "resume",
        width: "25%",
        ...getColumnSearchProps("resume"),
        sorter: (a, b) => a.resume.length - b.resume.length,
        editable: role === "Administrador" && true,
        sortDirections: ["descend", "ascend"],
        ellipsis: {
          showTitle: false
        },
        typeof: String,
        render: (resume) => (
          <Tooltip key={resume} placement="topLeft" title={resume}>
            {resume}
          </Tooltip>
        )
      },

      {
        title: "Cantidad",
        dataIndex: "quantity",
        key: "quantity",
        width: "6%",
        ...getColumnSearchProps("quantity"),
        sorter: (a, b) => a.quantity - b.quantity,
        sortDirections: ["descend", "ascend"],
        typeof: Number,
        editable:
          (role === "Administrador" && true) ||
          (role === "Administrador" && true)
      },
      {
        title: "Costo",
        dataIndex: "cost",
        key: "cost",
        width: "6%",
        ...getColumnSearchProps("cost"),
        sorter: (a, b) => a.cost - b.cost,
        sortDirections: ["descend", "ascend"],
        editable: role === "Administrador" && true,
        render: (_, record) => (
          <span key={record._id}>
            {role === "Administrador" ? record.cost : 0}
          </span>
        ),
        typeof: Number
      },
      {
        title: "Precio",
        dataIndex: "price",
        key: "price",
        width: "5%",
        ...getColumnSearchProps("price"),
        sorter: (a, b) => a.price - b.price,
        sortDirections: ["descend", "ascend"],
        editable: role === "Administrador" && true,
        typeof: String
      },
      {
        title: "Accion",
        dataIndex: "action",
        align: "right",
        key: "action",
        width: "10%",
        render: (_, record) => {
          const editable = isEditing(record);
          return editable ? (
            <span
              style={{
                display: "flex",
                justifyContent: "space-around",
                alignItems: "center"
              }}
            >
              <Typography
                onClick={() => save(record)}
                style={{
                  marginRight: 8
                }}
              >
                Guardar
              </Typography>
              <Popconfirm title="Sure to cancel?" onConfirm={()=> cancel()}>
                <p>Cancel</p>
              </Popconfirm>
            </span>
          ) : (
            <span
              style={{
                display: "flex",
                justifyContent: "space-around",
                alignItems: "center"
              }}
            >
              <Typography
                style={{ marginRight: "1rem" }}
                disabled={editingKey !== ""}
                onClick={() => edit(record)}
              >
                Editar
              </Typography>
              <Typography disabled={editingKey !== ""}>
                <Popconfirm
                  title="Sure to cancel?"
                  onConfirm={() => handleDelete(record)}
                >
                  Borrar
                </Popconfirm>
              </Typography>
            </span>
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
          inputType: col.typeof === String ? "text" : "number",
          dataIndex: col.dataIndex,
          title: col.title,
          editing: isEditing(record)
        })
      };
    });

    const handleSubmitNewItem = async (event) => {
      event.preventDefault();
      let newData = {
        name: watch("name"),
        brand: watch("brand"),
        size: parseInt(watch("size")),
        quantity: parseInt(watch("quantity")),
        resume: `${watch("resume")}, ${watch("name")}, ${watch(
          "brand"
        )}, ${watch("size")}, ${watch("color")}, ${watch("quantity")}, ${watch(
          "cost"
        )}, ${watch("price")}`,
        color: watch("color"),
        cost: parseInt(watch("cost")),
        price: parseInt(watch("price"))
      };
      const resp = await apiBase.post(`/item/new-order`, newData);
      console.log(
        "🚀 ~ file: ItemInTableInStock.jsx:434 ~ handleSubmitNewItem ~ resp:",
        resp
      );
      if (resp) {
        setValue("brand", "");
        setValue("name", "");
        setValue("size", "");
        setValue("color", "");
        setValue("resume", "");
        setValue("quantity", "");
        setValue("cost", "");
        setValue("price", "");
        setNewItem(false);
      }
    };
    // addNewItemInStockMutation.mutate(data)

    const handleCancelAction = () => {
      setValue("brand", "");
      setValue("name", "");
      setValue("size", "");
      setValue("color", "");
      setValue("resume", "");
      setValue("quantity", "");
      setValue("cost", "");
      setValue("price", "");
      setNewItem(false);
    };
    return (
      <>
        <Grid display={"flex"} flexDirection={"column"} container>
          <Grid item xs={12}>
            {" "}
            <Grid item xs={12}>
              <Form form={form} component={false}>
                <Table
                  columns={mergedColumns}
                  dataSource={inventoryQuery.data?.data?.inventory}
                  components={{
                    body: {
                      cell: EditableCell
                    }
                  }}
                  rowClassName="editable-row"
                />
              </Form>
            </Grid>
          </Grid>
          {newItem && (
            <Grid item xs={12}>
              <Grid item xs={12}>
                <Typography
                  style={{
                    color: "#101828",
                    lineHeight: "38px"
                  }}
                  textAlign={"left"}
                  fontWeight={600}
                  fontFamily={"Inter"}
                  fontSize={"35px"}
                >
                  Formuario para ingresar nuevo articulo
                </Typography>
              </Grid>
              <form>
                <Grid
                  gap={1}
                  justifyContent={"space-around"}
                  alignItems={"center"}
                  marginX={"auto"}
                  container
                >
                  <Grid marginY={1} item xs={5}>
                    <FormControl fullWidth>
                      <OutlinedInput
                        {...register("brand")}
                        placeholder="Marca del producto"
                        endAdornment={
                          <InputAdornment position="end">
                            <Tooltip
                              title="Casilla para colocar la marca del producto a ingresar"
                              placement="right"
                            >
                              <Icon
                                icon="mingcute:question-line"
                                width={25}
                                height={25}
                              />
                            </Tooltip>
                          </InputAdornment>
                        }
                      />
                    </FormControl>
                  </Grid>
                  <Grid marginY={1} item xs={5}>
                    <FormControl fullWidth>
                      <OutlinedInput
                        {...register("name")}
                        placeholder="Nombre del producto"
                        endAdornment={
                          <InputAdornment position="end">
                            <Tooltip
                              title="Casilla para colocar el nombre del producto a ingresar"
                              placement="right"
                            >
                              <Icon
                                icon="mingcute:question-line"
                                width={25}
                                height={25}
                              />
                            </Tooltip>
                          </InputAdornment>
                        }
                      />
                    </FormControl>
                  </Grid>
                  <Grid marginY={1} item xs={5}>
                    <FormControl fullWidth>
                      <OutlinedInput
                        {...register("color")}
                        placeholder="Color del producto"
                        endAdornment={
                          <InputAdornment position="end">
                            <Tooltip
                              title="Casilla para colocar el color del producto a ingresar"
                              placement="right"
                            >
                              <Icon
                                icon="mingcute:question-line"
                                width={25}
                                height={25}
                              />
                            </Tooltip>
                          </InputAdornment>
                        }
                      />
                    </FormControl>
                  </Grid>
                  <Grid marginY={1} item xs={5}>
                    <FormControl fullWidth>
                      <OutlinedInput
                        {...register("size")}
                        placeholder="Tamano del producto"
                        type="number"
                        endAdornment={
                          <InputAdornment position="end">
                            <Tooltip
                              title="Casilla para colocar el tamano del producto a ingresar"
                              placement="right"
                            >
                              <Icon
                                icon="mingcute:question-line"
                                width={25}
                                height={25}
                              />
                            </Tooltip>
                          </InputAdornment>
                        }
                      />
                    </FormControl>
                  </Grid>
                  <Grid marginY={1} item xs={5}>
                    <FormControl fullWidth>
                      <OutlinedInput
                        {...register("resume")}
                        placeholder="Descripcion del producto"
                        endAdornment={
                          <InputAdornment position="end">
                            <Tooltip
                              title="Casilla para colocar la descripcion del producto a ingresar"
                              placement="right"
                            >
                              <Icon
                                icon="mingcute:question-line"
                                width={25}
                                height={25}
                              />
                            </Tooltip>
                          </InputAdornment>
                        }
                      />
                    </FormControl>
                  </Grid>
                  <Grid marginY={1} item xs={5}>
                    <FormControl fullWidth>
                      <OutlinedInput
                        {...register("quantity")}
                        placeholder="Cantidad del producto"
                        type="number"
                        endAdornment={
                          <InputAdornment position="end">
                            <Tooltip
                              title="Casilla para colocar la candidad de unidades del producto a ingresar"
                              placement="right"
                            >
                              <Icon
                                icon="mingcute:question-line"
                                width={25}
                                height={25}
                              />
                            </Tooltip>
                          </InputAdornment>
                        }
                      />
                    </FormControl>
                  </Grid>
                  <Grid marginY={1} item xs={5}>
                    <FormControl fullWidth>
                      <OutlinedInput
                        {...register("cost")}
                        placeholder="Costo del producto"
                        type="number"
                        endAdornment={
                          <InputAdornment position="end">
                            <Tooltip
                              title="Casilla para colocar el costo original del producto a ingresar"
                              placement="right"
                            >
                              <Icon
                                icon="mingcute:question-line"
                                width={25}
                                height={25}
                              />
                            </Tooltip>
                          </InputAdornment>
                        }
                      />
                    </FormControl>
                  </Grid>
                  <Grid marginY={1} item xs={5}>
                    <FormControl fullWidth>
                      <OutlinedInput
                        {...register("price")}
                        placeholder="Precio del producto"
                        endAdornment={
                          <InputAdornment position="end">
                            <Tooltip
                              title="Casilla para colocar el precio final a la venta por unidad del producto a ingresar"
                              placement="right"
                            >
                              <Icon
                                icon="mingcute:question-line"
                                width={25}
                                height={25}
                              />
                            </Tooltip>
                          </InputAdornment>
                        }
                      />
                    </FormControl>
                  </Grid>
                  <Grid marginY={1} marginX={"auto"} gap={5} item xs={12}>
                    <Button onClick={handleCancelAction}>Cancelar</Button>
                    <Button onClick={handleSubmitNewItem}>Ingresar</Button>
                  </Grid>
                </Grid>
              </form>
            </Grid>
          )}
        </Grid>
      </>
    );
  }
};

export default ItemInTableInStock;
