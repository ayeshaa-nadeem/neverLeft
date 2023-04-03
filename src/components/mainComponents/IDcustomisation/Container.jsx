import React, { useState, useCallback, useEffect, Fragment } from "react";
import { useParams } from "react-router-dom";
import { Modal, Row, Col, message, Spin } from "antd";
import update from "immutability-helper";
import { Url } from "../../../utils/apiUrl.js";
import { getApiWithAuth, patchApiWithAuth } from "../../../utils/api";
import { Card } from "./Card.jsx";
import plusIcon from "../../../assets/images/plusIcon.svg";

const style = {
  display: "flex",
  flexWrap: "wrap",
};

export const Container = (props) => {
  {
    const [cards, setCards] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setisLoading] = useState(false);
    const [isLoadingModalData, setisLoadingModalData] = useState(false);
    const [hiddenAttributes, setHiddenAttributes] = useState([]);
    const [isCount, setIsCount] = useState(1);
    const { id } = useParams();

    const moveCard = useCallback((dragIndex, hoverIndex) => {
      setCards((prevCards) =>
        update(prevCards, {
          $splice: [
            [dragIndex, 1],
            [hoverIndex, 0, prevCards[dragIndex]],
          ],
        })
      );
    }, []);

    const allAtributes = async () => {
      setisLoading(true);
      const response = await getApiWithAuth(`${Url.getAllAttributes}${id}`);
      if (response.success) {
        setisLoading(false);
        setCards(response.data.attributes);
        if (isCount == 1) {
          message.success("Got Data");
          setIsCount(2);
        } else if (isCount == 2) {
          message.success("Data Updated Successfully");
        }
      } else {
        setisLoading(false);
        message.error("Failed to get Records");
      }
    };

    const reorderCards = async () => {
      const temp = cards?.map((item, index) => ({
        ...item,
        order: index + 1,
      }));
      const response = await patchApiWithAuth(`${Url.updateOrders}${id}`, temp);
      if (response.success) {
        props.getAllData();
        allFieldsInModal();
      } else {
        message.error("Failed to Order Records");
      }
    };

    const deleteCategory = async (item) => {
      const temp = cards.filter((item1) => item1?.label == item);
      const temp1 = [{ ...temp[0], isHide: true }];
      const response = await patchApiWithAuth(
        `${Url.updateOrders}${id}`,
        temp1
      );
      if (response.success) {
        props.getAllData();
        allAtributes();
      } else {
        message.error("Failed to remove records");
      }
    };

    const allFieldsInModal = async () => {
      const response = await getApiWithAuth(`${Url.getHiddenAttributes}${id}`);
      if (response.success) {
        setHiddenAttributes(response.data.filter((item) => item?.label));
        setisLoadingModalData(false);
      } else {
        message.error("Failed to get Deleted Attributes");
        setisLoadingModalData(false);
      }
    };

    const addHiddenAttribute = async (item) => {
      setisLoadingModalData(true);
      const temp1 = [{ ...item, isHide: false }];
      const response = await patchApiWithAuth(
        `${Url.updateOrders}${id}`,
        temp1
      );
      if (response.success) {
        const response = await getApiWithAuth(
          `${Url.getHiddenAttributes}${id}`
        );
        if (response.success) {
          setHiddenAttributes(response.data.filter((item) => item?.label));
          setisLoadingModalData(false);
        } else {
          message.error("Failed to get Deleted Attributes");
          setisLoadingModalData(false);
        }
      } else {
        message.error("Failed to Add records");
      }
    };

    const showModal = () => {
      setIsModalOpen(true);
      allFieldsInModal();
    };

    const handleOk = () => {
      allAtributes();
      setIsModalOpen(false);
    };

    const handleCancel = () => {
      allAtributes();
      setIsModalOpen(false);
    };

    useEffect(() => {
      allAtributes();
    }, []);

    useEffect(() => {
      if (cards?.length > 0) {
        reorderCards();
      }
    }, [cards]);

    return (
      <div style={{}}>
        {isLoading ? (
          <Spin size="large" />
        ) : (
          <div style={style} className="cardStyle">
            <div className="cardScrollContent">
              <Row gutter={[0, 12]}>
                {cards.length == 0 ? (
                  <p className="noDataWhite">
                    Click bottom button to add records
                  </p>
                ) : (
                  cards.length > 0 &&
                  cards.filter((item) => {
                    return item !== null && item.key !== "idstatus"
                  }).map((card, index) => {
                    return (
                      <Fragment key={card.key} >
                        <Col xxl={12} xl={24}>
                          <Card
                            key={card?.order}
                            index={index}
                            id={card?.order}
                            text={card?.label}
                            moveCard={moveCard}
                            deleteCategory={deleteCategory}
                          />
                        </Col>
                      </Fragment>
                    );
                  })
                )}
              </Row>
            </div>
          </div>
        )}
        <div className="iconParentDiv">
          <div className="plusIconStyling" onClick={showModal}>
            <img src={plusIcon} />
          </div>
        </div>
        <Modal
          title="Get All Attributes"
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
          okText="Cancel"
          cancelButtonProps={{ style: { display: "none" } }}
        >
          {isLoadingModalData ? (
            <div className="spinerStying">
              <Spin size="large" />
            </div>
          ) : (
            <div className="modalListingAttributes">
              <div className="modalCardScroll">
                <Row gutter={[16, 16]}>
                  {hiddenAttributes.length == 0 ? (
                    <p className="noData">No data to show</p>
                  ) : (
                    hiddenAttributes?.map((item) => {
                      return (
                        <Col className="gutter-row" span={8} key={item.key}>
                          <div className="modalAttributes">
                            <h1>{item?.label}</h1>
                            <div
                              className="modalPlusIcon"
                              onClick={() => addHiddenAttribute(item)}
                            >
                              <img src={plusIcon} />
                            </div>
                          </div>
                        </Col>
                      );
                    })
                  )}
                </Row>
              </div>
            </div>
          )}
        </Modal>
      </div>
    );
  }
};
