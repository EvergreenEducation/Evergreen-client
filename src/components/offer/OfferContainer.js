import React, { useEffect, useState } from 'react';
import { imported } from 'react-imported-component/macro';
import { useHistory } from 'react-router-dom';
import { Card, Drawer, Button, message, Layout, Col } from 'antd';
import useAxios, { configure } from 'axios-hooks';
import OfferTable from 'components/offer/OfferTable';
import useGlobalStore from 'store/GlobalStore';
import axiosInstance from 'services/AxiosInstance';
import {
  SearchHeader,
  ProviderLogOutTopbar,
  FaPlusCircleButton,
} from 'components/shared';
import matchSorter from 'match-sorter';
const axios = require('axios').default;

const { Content } = Layout;

const FormModal = imported(() => import('components/shared/FormModal'));

const OfferCreationContainer = imported(() =>
  import('components/offer/OfferCreationContainer')
);

const OfferUpdateModal = imported(() =>
  import('components/offer/OfferUpdateModal')
);

const BatchEnrollmentModal = imported(() =>
  import('components/enrollment/BatchEnrollmentModal')
);

configure({
  axios: axiosInstance,
});

export default function OfferContainer(props) {
  const [searchString, setSearchString] = useState('');
  const { basePath, openProviderUpdateModal, role, providerId } = props;
  const history = useHistory();
  const [openable, setOpenable] = useState({
    drawer: false,
    updateModal: false,
    batchEnrollModal: false,
    formModal: false,
  });
  const [selectedOffer, setSelectedOffer] = useState({});
  const { datafield, provider, offer: offerStore } = useGlobalStore();
  const { entities = [] } = offerStore;


  const [{ data: getProviderData = [], error: providerError }] = useAxios(
    '/providers?scope=with_datafields'
  );

  const [{ data: datafieldsData, error: datafieldError }] = useAxios(
    '/datafields'
  );

  let getOffersUrl =
    role === 'provider'
      ? `/offers?scope=with_details&provider_id=${providerId}`
      : '/offers?scope=with_details';

  const [{ data: offersData, error: offerError }] = useAxios(getOffersUrl);


  const getPdfData = async (offer) => {
    let user_id = offer.id
    let pdfData = await axios.post(`${process.env.REACT_APP_API_URL}/api/v1/files/delete_offer`, {
      user_id
    })
    return pdfData
  }

  const openAndPopulateUpdateModal = (offer) => {
    setSelectedOffer(offer);
    setOpenable({
      ...openable,
      updateModal: true,
    });
  };
  let Deletedata = false
  const handleDeleteModal = (offer) => {
    setSelectedOffer(offer);
    Deletedata = true
    if (Deletedata) {
      offerStore.removeOne(offer)
      getPdfData(offer).then(resp => {
        // console.log("resp", resp)
        getOfferListData();
      }).catch(error => {
        console.log(error, "error")
      })
    }
    // setOpenable({
    //   ...openable,
    //   updateModal: true,
    // });
  };

  const handleRowSelection = (record, rowIndex) => {
    if (record) {
      setSelectedOffer(record);
      setOpenable({
        ...openable,
        drawer: true,
      });
      return;
    }
    message.error("Could not receive offer's information.");
  };

  const openBatchEnrollmentModal = () => {
    setOpenable({
      ...openable,
      batchEnrollModal: true,
      drawer: true,
    });
  };

  const viewEnrollments = (offer) => {
    if (offer) {
      history.push(`${basePath}/enrollments?offer=${offer.id}`);
      return;
    }
    message.error("Could not receive offer's information.");
  };

  if (providerError || datafieldError || offerError) {
    history.push('/error/500');
  }

  const handleDataAfterSearch = (data, keys = ['name', 'keywords']) => {
    return matchSorter(data, searchString, { keys });
  };

  const handleDataSearch = (searchVal) => {
    return setSearchString(searchVal);
  };

  let showData = handleDataAfterSearch(Object.values(entities));

  if (role === 'provider') {
    showData = showData.filter((offer) => {
      return offer.provider_id === providerId;
    });
  }

  useEffect(() => {
    if (getProviderData) {
      provider.addMany(getProviderData);
    }
    if (datafieldsData) {
      datafield.addMany(datafieldsData);
    }
    if (offersData) {
      offerStore.addMany(offersData);
    }
  }, [getProviderData, datafieldsData, offersData]);

  const [getOffersList, setOffersList] = useState();

  // Calling of offerlist api
  function getOfferListData() {
    getOfferList().then(res => {
      if (role === "provider") {
        if (providerId) {
          showProviderOfferList(res.data);
        }
      } else {
        setOffersList(res.data)
      }
    }).catch(err => {
      console.log('errr', err)
    })
  }

  // show provider list incase role is admin
  function showProviderOfferList(data) {
    if (data.length) {
      let arr = [];
      for (let i = 0; i < data.length; i++) {
        if (providerId === data[i].provider_id) {
          arr.push(data[i])
        } else {
        }
      }
      setOffersList(arr)
    } else {
    }
  }

  // Api of get offer list
  const getOfferList = async () => {
    let Data = await axios.get(`${process.env.REACT_APP_API_URL}/api/v1/offers?scope=with_details`)
    return Data
  }

  // const getProviderOfferList = () => {
  //   getProviderOfferApi().then(res => {
  //     if (providerId) {
  //       showProviderOfferList(res.data);
  //     }
  //   }).catch(err => {
  //     console.log('err', err)
  //   })
  // }

  const getProviderOfferApi = async () => {
    let Data = await axios.get(`${process.env.REACT_APP_API_URL}/api/v1/offers?scope=with_details&provider_id=${providerId}`)
    return Data
  }

  useEffect(() => {
    getOfferListData()
  }, [])
  // console.log('showData :: ', showData, '\n\t getOffersList::', getOffersList)
  return (
    <Layout className="bg-transparent">
      <ProviderLogOutTopbar role={role} onClick={openProviderUpdateModal}>
        <Col span={14}>
          <SearchHeader
            title="NEW OFFERS / OPPORTUNITIES"
            onSearch={handleDataSearch}
          >
            <FaPlusCircleButton
              onMouseEnter={() => {
                FormModal.preload();
                OfferCreationContainer.preload();
              }}
              onClick={() => setOpenable({ ...openable, formModal: true })}
              text="OFFER" className="offer-btn" />
          </SearchHeader>
        </Col>
      </ProviderLogOutTopbar>
      <Content className="p-6">
        <Card className="shadow-md rounded-md">
          <OfferTable
            datafields={datafield.entities}
            providers={provider.entities}
            // data={showData}
            data={getOffersList}
            handleUpdateModal={openAndPopulateUpdateModal}
            handleDeleteModal={handleDeleteModal}
            handleRowSelection={handleRowSelection}
            viewEnrollments={viewEnrollments}
            role={role}
          />
          {/* <OfferPdfTable
            datafields={datafield.entities}
            providers={provider.entities}
            data={showData}
            handleUpdateModal={openAndPopulateUpdateModal}
            handleRowSelection={handleRowSelection}
            viewEnrollments={viewEnrollments}
            role={role} /> */}
          <FormModal
            title="New Offer / Opportunity"
            visible={openable.formModal}
            FormComponent={OfferCreationContainer}
            getOfferListData={getOfferListData}
            role={role}
            providerId={providerId}
            onCancel={() => setOpenable({ ...openable, formModal: false })}
          />
          <OfferUpdateModal
            offer={selectedOffer}
            visible={openable.updateModal}
            getOfferListData={getOfferListData}
            onCancel={() => setOpenable({ ...openable, updateModal: false })}
            offerStore={offerStore}
            scopedToProvider={false}
            role={role}
          />
          <Drawer
            placement="bottom"
            visible={openable.drawer}
            onClose={() => setOpenable({ ...openable, drawer: false })}
            height={85}
          >
            <Button
              className="rounded"
              type="primary"
              onClick={() => openBatchEnrollmentModal()}
              onMouseEnter={() => BatchEnrollmentModal.preload()}
            >
              Batch Enroll
            </Button>
            <BatchEnrollmentModal
              offer={selectedOffer}
              visible={openable.batchEnrollModal}
              onSubmit={() =>
                setOpenable({
                  ...openable,
                  batchEnrollModal: false,
                  drawer: false,
                })
              }
              onCancel={() =>
                setOpenable({
                  ...openable,
                  batchEnrollModal: false,
                })
              }
            />
          </Drawer>
        </Card>
      </Content>
    </Layout>
  );
}
