import React, { useEffect, useState } from 'react';
import { imported } from 'react-imported-component/macro';
import { useHistory } from 'react-router-dom';
import { Card, Layout, Col } from 'antd';
import useAxios, { configure } from 'axios-hooks';
import PathwaysTable from 'components/pathway/PathwaysTable';
import PathwaysPdfTable from 'components/pathway/PathwayPdfTable'
import useGlobalStore from 'store/GlobalStore';
import axiosInstance from 'services/AxiosInstance';
import matchSorter from 'match-sorter';
import {
  SearchHeader,
  ProviderLogOutTopbar,
  FaPlusCircleButton,
} from 'components/shared';
import Provider from 'store/Provider';
const axios = require('axios').default;

const FormModal = imported(() => import('components/shared/FormModal'));

const PathwayCreationContainer = imported(() =>
  import('components/pathway/PathwayCreationContainer')
);

const PathwayUpdateModal = imported(() =>
  import('components/pathway/PathwayUpdateModal')
);

configure({
  axios: axiosInstance,
});

const { Content } = Layout;

export default function PathwayContainer({
  role,
  providerId,
  openProviderUpdateModal,
}) {
  console.log("shubham",providerId)
  const [searchString, setSearchString] = useState('');
  const history = useHistory();
  const [modalStates, setModalStates] = useState({
    pathwayCreation: false,
    pathwayUpdate: false,
    // pathwayDelete: false
  });

  // const [pathwayDelete, setPathwayDelete] = useState(false)

  const [selectedPathway, setSelectedPathway] = useState({});
  const {
    datafield,
    provider: providerStore,
    pathway: pathwayStore,
    offer: offerStore,
  } = useGlobalStore();

  let getPathwaysUrl =
    role === 'provider'
      ? `/pathways?scope=with_details&provider_id=${providerId}`
      : '/pathways?scope=with_details';

  const [{ data: getPathways, error: getPathwaysError }] = useAxios(
    getPathwaysUrl
  );

  const [{ data: getDataFields, error: getDataFieldsError }] = useAxios(
    '/datafields'
  );

  const [{ data: getOffers, error: getOffersError }] = useAxios('/offers');

  let getProviderUrl =
    role === 'provider' ? `/providers/${providerId}` : '/providers';

  const [{ data: getProviders }] = useAxios(getProviderUrl);

  const getPdfData = async (pathway) => {
    let user_id = pathway.id
    let pdfData = await axios.post(`${process.env.REACT_APP_API_URL}/api/v1/files/delete_pathway`, {
      user_id
    })
    return pdfData
  }

  const openAndPopulateUpdateModal = (pathway) => {
    setSelectedPathway(pathway);
    setModalStates({ ...modalStates, pathwayUpdate: true });
  };

  let pathwayDelete =  false
  const openAndDeleteModal = (pathway) => {
      // setPathwayDelete(true);
      pathwayDelete =true
    if (pathwayDelete) {
      pathwayStore.removeOne(pathway)
      getPdfData(pathway).then(resp => {
        console.log(resp, "resposssssssssss")
        getPathwayListData();
      }).catch(error => {
        console.log(error, "errorr")
      })
    }
  };

  if (getPathwaysError || getOffersError || getDataFieldsError) {
    history.push('/error/500');
  }
  // console.log("modalStates",modalStates.pathwayDelete)
  useEffect(() => {
    if (getPathways) {
      pathwayStore.addMany(getPathways);
    }
    if (getOffers) {
      offerStore.addMany(getOffers);
    }
    if (getProviders) {
      if (role === 'provider') {
        providerStore.addOne(getProviders);
      } else {
        providerStore.addMany(getProviders);
      }
    }
    if (getDataFields) {
      datafield.addMany(getDataFields);
    }
  }, [getPathways, getOffers, getProviders, getDataFields]);

  const handleDataAfterSearch = (data, keys = ['name', 'keywords']) => {
    return matchSorter(data, searchString, { keys });
  };

  const handleDataSearch = (searchVal) => {
    return setSearchString(searchVal);
  };

  let showData = handleDataAfterSearch(Object.values(pathwayStore.entities));

  if (role === 'provider') {
    showData = showData.filter((p) => {
      return p.provider_id === providerId;
    });
  }

  const [getPathwayList,setPathwayList]=useState();
  
  // Calling of pathway list api
  function getPathwayListData(){
    pathwayListData().then(res=>{
      if(role==="provider"){
        if(providerId){
          showProviderOfferList(res.data);
        }
      }else{
        setPathwayList(res.data)
      }


      
    }).catch(err=>{
      console.log('errr',err)
    })
  }

// Api of get offer list
  const pathwayListData = async () => {
    let Data = await axios.get(`${process.env.REACT_APP_API_URL}/api/v1/pathways?scope=with_details`)
    return Data
  }

  useEffect(()=>{
    getPathwayListData()
  },[])


  // show provider list incase role is admin
 function showProviderOfferList(data){
  if(data.length){
    let arr=[];
    for(let i=0;i<data.length;i++){
      if(providerId === data[i].provider_id){
        arr.push(data[i])
      }else{
      }
    }
    setPathwayList(arr)
  }else{
  }
 }


  console.log('getPathwayList',getPathwayList)

  return (
    <Layout className="bg-transparent">
      <ProviderLogOutTopbar role={role} onClick={openProviderUpdateModal}>
        <Col span={14}>
          <SearchHeader title="PATHWAYS" onSearch={handleDataSearch}>
            <FaPlusCircleButton
              onMouseEnter={() => {
                FormModal.preload();
                PathwayCreationContainer.preload();
              }}
              onClick={() =>
                setModalStates({ ...modalStates, pathwayCreation: true })
              }
              text="PATHWAY"
            />
          </SearchHeader>
        </Col>
      </ProviderLogOutTopbar>
      <Content className="p-6">
        <Card className="shadow-md rounded-md">
          <PathwaysTable
            datafields={datafield.entities}
            providers={providerStore.entities}
            // data={showData}
            data={getPathwayList}
            handleUpdateModal={openAndPopulateUpdateModal}
            handleDeleteModal={openAndDeleteModal}
            offers={offerStore.entities}
          />
          {/* <PathwaysPdfTable
           datafields={datafield.entities}
           providers={providerStore.entities}
           data={showData}
           handleUpdateModal={openAndPopulateUpdateModal}
           offers={offerStore.entities} /> */}
          <FormModal
            title="New Pathway"
            visible={modalStates.pathwayCreation}
            FormComponent={PathwayCreationContainer}
            role={role}
            providerId={providerId}
            getPathwayListData={getPathwayListData}
            onCancel={() =>
              setModalStates({ ...modalStates, pathwayCreation: false })
            }
          />
          <PathwayUpdateModal
            pathway={selectedPathway}
            visible={modalStates.pathwayUpdate}
            getPathwayListData={getPathwayListData}
            onCancel={() =>
              setModalStates({ ...modalStates, pathwayUpdate: false })
            }
            pathwayStore={pathwayStore}
            role={role}
            providers={Object.values(providerStore.entities)}
          />
        </Card>
      </Content>
    </Layout>
  );
}
