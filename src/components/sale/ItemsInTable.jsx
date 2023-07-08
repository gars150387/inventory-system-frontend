import { SearchOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { Button, Input, Space, Table, Tooltip } from "antd";
import { useRef, useState } from "react";
import Highlighter from "react-highlight-words";
import { apiBase } from "../api/Api";
import { Icon } from "@iconify/react";
import NewOrder from "./NewOrder";
import { useDispatch, useSelector } from "react-redux";
import { onAddToOrder } from "../../store/slices/orderSlice";

const ItemsInTable = () => {
  const [item, setItem] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const { order } = useSelector(state => state.order)
  const searchInput = useRef(null);
  const dispatch = useDispatch();
  const inventoryQuery = useQuery({
    queryKey: ["inventory"],
    queryFn: () => apiBase.get("/item/inventory")
  });

  if (inventoryQuery.isLoading) return <p>Cargando inventario...</p>;
  if (inventoryQuery.data) {
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
    const handleItemInCart = (record) => {
        if(order.find(item => item._id === record._id)){
            return alert("Articulo existe en la orden, favor modificar la cantidad")
        }
      let result = [...item, record];
      setItem(result);
      dispatch(onAddToOrder(record));
    };
    const columns = [
      {
        title: "Name",
        dataIndex: "name",
        key: "name",
        width: "20%",
        ...getColumnSearchProps("name")
      },
      {
        title: "Marca",
        dataIndex: "brand",
        key: "brand",
        width: "12%",
        ...getColumnSearchProps("brand")
      },
      {
        title: "Color",
        dataIndex: "color",
        key: "color",
        width: "10%",
        ...getColumnSearchProps("color"),
        sorter: (a, b) => a.color.length - b.color.length,
        sortDirections: ["descend", "ascend"]
      },
      {
        title: "Descripcion",
        dataIndex: "resume",
        key: "resume",
        width: "30%",
        ...getColumnSearchProps("resume"),
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
        key: "size",
        width: "6%",
        ...getColumnSearchProps("size"),
        sorter: (a, b) => a.size.length - b.size.length,
        sortDirections: ["descend", "ascend"]
      },
      {
        title: "Cantidad",
        dataIndex: "quantity",
        key: "quantity",
        width: "6%",
        ...getColumnSearchProps("quantity"),
        sorter: (a, b) => a.quantity.length - b.quantity.length,
        sortDirections: ["descend", "ascend"]
      },
      {
        title: "Precio/Unidad",
        dataIndex: "price",
        key: "price",
        width: "6%",
        ...getColumnSearchProps("price"),
        sorter: (a, b) => a.price.length - b.price.length,
        sortDirections: ["descend", "ascend"]
      },
      {
        title: "Agregar",
        dataIndex: "action",
        key: "action",
        width: "6%",
        render: (_, record) => (
          <Icon
            icon="grommet-icons:cart"
            color="#000"
            width={20}
            height={20}
            onClick={() => handleItemInCart(record)}
          />
        )
      }
    ];
    return (
      <>
        <Table
          columns={columns}
          dataSource={inventoryQuery.data.data.inventory}
        />{" "}
        <div className="d-none">
          <NewOrder item={item} />
        </div>
      </>
    );
  }
};
export default ItemsInTable;
