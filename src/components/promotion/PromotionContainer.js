import React, { useState, useEffect } from 'react';
import { Layout, Button, Empty, Popover, Switch, Row, Col, Select, Table } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import matchSorter from 'match-sorter';
import useAxios, { configure } from 'axios-hooks';
import axiosInstance from 'services/AxiosInstance';
import { LogOutTopbar, SearchHeader, TitleDivider } from 'components/shared';
import useGlobalStore from 'store/GlobalStore';
import PromoteCard from 'components/promotion/PromoteCard/PromoteCard';
import { getGenericData } from 'components/datafield/GenericContainer';
import { ToastContainer, toast } from 'react-toastify';
import Avatar from 'antd/lib/avatar/avatar';

const axios = require('axios').default;
const { Column } = Table;
toast.configure();

configure({
  axios: axiosInstance,
});

const { Content } = Layout;
const { Option } = Select;

const preloadOptions = (data = []) =>
  data.map((item, index) => {
    return (
      <Option value={item.id} key={index.toString()}>
        {item.name}
      </Option>
    );
  });

export default function (props) {
  const { session } = props;
  const adminId = session.id;
  const [searchString, setSearchString] = useState('');
  const [showPromoted, setShowPromoted] = useState(true);
  const [fileData, setFileData] = useState()
  const [inputFile, setInputFile] = useState({
    files: [],
    name: ""
  })
  const [getValue, setGetValue] = useState()
  const [isHide, setIsHide] = useState(false)
  const [bannerList, setBannerList] = useState([])
  const [filters, setFilters] = useState({
    offer: true,
    pathway: true,
    provider: true,
  });
  const {
    provider: providerStore,
    pathway: pathwayStore,
    offer: offerStore,
    datafield: dataFieldStore
  } = useGlobalStore();

  const [{ data: getPathways }, refetchPathway] = useAxios('/pathways?scope=with_files');
  const [{ data: getOffers }, refetchOffer] = useAxios('/offers?scope=with_files');
  const [{ data: getProviders }, refetchProvider] = useAxios('/providers?scope=with_files');
  const [{ data: getDataField }] = useAxios('/datafields?type=topic');

  const [activePageId, setActivePageId] = useState({
    id: 0,
    page_route: "default"
  });

  // const [selectedTopicValue, setSelectedTopicValue] = useState([]);

  const offers = Object.values(offerStore.entities).map((o) => {
    return {
      ...o,
      entity_type: 'offer',
    };
  });

  const providers = Object.values(providerStore.entities).map((p) => {
    return {
      ...p,
      entity_type: 'provider',
    };
  });

  const pathways = Object.values(pathwayStore.entities).map((p) => {
    return {
      ...p,
      entity_type: 'pathway',
    };
  });

  const datafield = Object.values(dataFieldStore.entities).map((p) => {
    return {
      ...p,
      entity_type: 'datafield',
    };
  });


  function toggleFilter(key = 'offer') {
    setFilters({
      ...filters,
      [key]: !filters[key],
    });
  }

  function allApiCall() {
    refetchPathway();
    refetchOffer();
    refetchProvider();
  }

  const data = [...offers, ...pathways, ...providers];

  const [selectedTopicValue, setSelectedTopicValue] = useState([]);

  const getTopicsList = async () => {
    // console.log('getTopicsList', data)
    getAllTopicData().then(res => {
      let idArray = [], getDataField = res.data.length ? res.data : [];
      if (getDataField) {
        for (let i = 0; i < getDataField.length; i++) {
          if (getDataField[i].page_id.length) {
            for (let x = 0; x < getDataField[i].page_id.length; x++) {
              // console.log('getDataField[i].page_id', getDataField[i].page_id)
              if (getDataField[i].page_id[x] === activePageId.id) {
                idArray.push(getDataField[i].id);
              }
            }
          } else {
          }
        }
        idArray = idArray.filter(function (item, index, inputArray) {
          return inputArray.indexOf(item) == index;
        });
        setPreCheckedTopic(idArray);
        setSelectedTopicValue(idArray);
        if (idArray.length) {
          setIsPrefilledTopic(true)
        } else {
          setIsPrefilledTopic(false)
        }
      }
    }).catch(err => {
      console.log(err, 'err')
    })
  }


  const getAllTopicData = async () => {
    let Data = await axios.get(`${process.env.REACT_APP_API_URL}/api/v1/datafields?type=topic`);
    return Data
  }

  // update topic data in topic list when user submit
  const updateData = async (selectedTopicValue, page_url_check) => {
    // console.log("-----------", selectedTopicValue)
    let user_id = selectedTopicValue
    let Data = await axios.post(`${process.env.REACT_APP_API_URL}/api/v1/files/update_topic`, {
      user_id, page_url_check
    })
    return Data
  }

  // update topic data in topic list when user submit
  const updateTopicRoute = async (selectedTopicValue, page_url_check, page_id) => {
    // console.log("-----------", selectedTopicValue)
    let user_id = selectedTopicValue
    let Data = await axios.post(`${process.env.REACT_APP_API_URL}/api/v1/files/update_topic_route`, {
      user_id, page_url_check, page_id
    })
    return Data
  }

  // delete topic data in topic list when user submit
  const deleteTopicRoute = async (selectedTopicValue, page_url_check, page_id) => {
    // console.log("-----------", selectedTopicValue)
    let user_id = selectedTopicValue
    let Data = await axios.post(`${process.env.REACT_APP_API_URL}/api/v1/files/delete_topic_route`, {
      user_id, page_url_check, page_id
    })
    return Data
  }
  // remove selected topic when user click on remove button
  const deleteTopicData = async (selectedTopicValue, page_url_check) => {
    // console.log("-----------", selectedTopicValue)
    let user_id = selectedTopicValue
    let Data = await axios.post(`${process.env.REACT_APP_API_URL}/api/v1/files/delete_topic`, {
      user_id, page_url_check
    })
    return Data
  }

  function filterContent() {
    return (
      <div>
        <Row className="justify-between mb-1" gutter={6}>
          <Col>Providers</Col>
          <Col>
            <Switch
              size="small"
              defaultChecked={filters.provider}
              onClick={() => toggleFilter('provider')}
            />
          </Col>
        </Row>
        <Row className="justify-between mb-1" gutter={6}>
          <Col>Offers</Col>
          <Col>
            <Switch
              size="small"
              defaultChecked={filters.offer}
              onClick={() => toggleFilter('offer')}
            />
          </Col>
        </Row>
        <Row className="justify-between" gutter={6}>
          <Col>Pathways</Col>
          <Col>
            <Switch
              size="small"
              defaultChecked={filters.pathway}
              onClick={() => toggleFilter('pathway')}
            />
          </Col>
        </Row>
      </div>
    );
  }

  const handleDataSearch = (searchVal) => {
    setSearchString(searchVal);
    // return setSearchString(searchVal);
  };

  const handleOnChange = (event) => {
    // getting value from event object
    let { value } = event.target;
    // console.log('handleOnChange', value)
    if (showPromoted) {
      setShowPromoted(false);
    }
    if (value.length === 0) {
      setShowPromoted(true);
    }
    setSearchString(value);
  };

  const handleDataAfterSearch = (data, keys = ['name', 'keywords']) => {
    return data && data.length ? data.filter(x => {
      if (x.type) {
        // console.log('handleDataAfterSearch', x.type)
        return false
      } else {
        return true
      }
    }) : []
    // return matchSorter(data, searchString, { keys });
  };
  const [cardButtonStatus, setcardButtonStatus] = useState({
    mainButtonStatus: false,
    localButtonStatus: false
  });
  let showData = handleDataAfterSearch(data);
  if (showPromoted) {
    showData = showData.filter((d) => {
      // check if local and main are true
      let isBothTrue = d.is_local_promo && d.is_main_promo,
        // check if local and main are true then we set local false
        isLocalPromoTrue = isBothTrue ? false : d.is_local_promo,
        // check if local and main are true then we set main false
        isMainPromo = isBothTrue ? false : d.is_main_promo,

        { custom_page_promo_ids, custom_page_local_ids } = d,
        localPromotionArray = [], mainPromotionArray = [];
      if (custom_page_promo_ids) {
        if (custom_page_promo_ids.length) {
          mainPromotionArray = uniqueArray(custom_page_promo_ids);
        }
      }
      if (custom_page_local_ids) {
        if (custom_page_local_ids.length) {
          localPromotionArray = uniqueArray(custom_page_local_ids);
        }
      }

      if (filters.offer && d.entity_type === 'offer') {
        let status = ifBothTrue(localPromotionArray, mainPromotionArray)
        return status;
      }
      if (filters.provider && d.entity_type === 'provider') {
        let status = ifBothTrue(localPromotionArray, mainPromotionArray)
        return status;
      }
      if (filters.pathway && d.entity_type === 'pathway') {
        let status = ifBothTrue(localPromotionArray, mainPromotionArray)
        return status;
      }
      return false;
    });
  } else {
    showData = showData.filter((d) => {
      let { custom_page_promo_ids, custom_page_local_ids } = d,
        localPromotionArray = [], mainPromotionArray = [];
      if (custom_page_promo_ids) {
        if (custom_page_promo_ids.length) {
          mainPromotionArray = uniqueArray(custom_page_promo_ids);
        }
      }
      if (custom_page_local_ids) {
        if (custom_page_local_ids.length) {
          localPromotionArray = uniqueArray(custom_page_local_ids);
        }
      }
      let mainInclude = mainPromotionArray.indexOf(activePageId.id), localInclude = localPromotionArray.indexOf(activePageId.id);

      if (filters.offer && d.entity_type === 'offer') {
        return true;
      }
      if (filters.provider && d.entity_type === 'provider') {
        return true;
      }
      if (filters.pathway && d.entity_type === 'pathway') {
        return true;
      }
      return false;
    });
  }


  function uniqueArray(idArray) {
    idArray = idArray.filter(function (item, index, inputArray) {
      if (item === null || item === undefined) {
        return false
      } else {
        return inputArray.indexOf(item) == index;
      }
    });
    return idArray
  }


  function ifBothTrue(localPromotionArray, mainPromotionArray) {
    if (localPromotionArray.length || mainPromotionArray.length) {
      let isLocalTrue = localPromotionArray.includes(activePageId.id),
        isMainTrue = mainPromotionArray.includes(activePageId.id);
      if (isLocalTrue) {
        return true
      } if (isMainTrue) {
        return true
      } if (isMainTrue && isLocalTrue) {
        return true
      }
    }
  }


  useEffect(() => {
    if (getPathways) {
      pathwayStore.addMany(getPathways);
    }
    if (getOffers) {
      offerStore.addMany(getOffers);
    }
    if (getProviders) {
      providerStore.addMany(getProviders);
    }
    if (getDataField) {
      providerStore.addMany(getDataField)
    }
  }, [getPathways, getOffers, getProviders, getDataField]);

  const getBannerApi = async () => {
    let token = JSON.parse(localStorage.getItem("currentSession"))
    let user_id = token.id
    let user_role = token.role
    let page_id = activePageId.id;
    // let urlAfterSlash='',pageUrl=activePageId.page_route==="default"? activePageId.page_route:activePageId.page_route.split('/');
    // if(pageUrl === "default"){
    //   urlAfterSlash="default"
    // }else{
    //   for(let i=3;i<pageUrl.length;i++){
    //     urlAfterSlash=urlAfterSlash+ pageUrl[i] + "/";
    //     console.log('urlAfterSlash',urlAfterSlash.slice(0, -1))
    //   }
    // }
    // let page_url_check =urlAfterSlash.slice(0, -1);
    // console.log('page_url_check', page_id)
    // console.log("filesdataaaa", user_id, user_role)
    let Data = await axios.get(`${process.env.REACT_APP_API_URL}/api/v1/files/get_banner_list/${page_id}`)
    return Data
  }

  useEffect(() => {
    getBannerApi().then(resp => {
      // console.log(resp, "resp")
      // let finaldata = []
      // resp.data.data.map((item,i) => {
      //   let imagedata = item.landing_imageshowCustomPromotionSetting
      //   imagedata && imagedata.map(it => {
      //     let parsedata = JSON.parse(it)
      //     finaldata.push(parsedata)
      //   })
      // })
      setBannerList(resp.data.data)
      // console.log(finaldata, "parssssssssssss")
    }).catch(error => {
      console.log(error, "error")
    })
  }, [])

  // const handleMultipleDropdown = (value) => {
  //   // console.log('valeue', value)
  //   setSelectedTopicValue(value)
  // }

  // submit selected option in promotion page
  // const submitSelectedTopics = (event) => {
  //   // console.log('electedTopicValue', selectedTopicValue)
  //   updateData(selectedTopicValue).then(resp => {
  //     // console.log(resp, "reeeeeeeee")
  //   }).catch(error => {
  //     console.log(error, "errroor")
  //   })
  // }

  const onChangeUpload = (e) => {
    let emailvalue = { ...inputFile, files: e.target.files }
    setInputFile(emailvalue)
    if (e.target.files.length) {
      handleButton(e.target.files)
    }
  }

  const handleButton = async (files) => {
    // console.log(files)
    await fileDataApi(files).then(async resp => {
      // console.log(resp, "responssssssssssss")
      setFileData(resp.data.data)
    }).catch(error => {
      console.log(error, "erorrr")
    })
  }
  const notify = msg => {
    if (msg == "error") {
      toast.error("Please send the valid params")
    } else if (msg == "success") {
      toast.success("Data Save Successfully")
    } else if (msg == "netork") {
      toast.network("Network error Please check again")
    }
  }
  const fileDataApi = async (inputFile) => {
    let fileData = inputFile
    // console.log("filesdataaaa", fileData)
    const data = new FormData();
    for (const File of fileData) {
      data.append('files', File);
    }
    let pdfData = await axios.post(`${process.env.REACT_APP_API_URL}/api/v1/files/upload_single_file`, data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return pdfData
  }

  const addFileData = async ({ fileData, inputFile }) => {
    let token = JSON.parse(localStorage.getItem("currentSession"))
    let user_id = token.id
    let user_role = token.role
    let landing_image = fileData
    // let page_url_check = activePageId.page_route;
    let page_url_check = activePageId.page_route === "default" ? activePageId.page_route : activePageId.page_route.split('/')[3];
    let page_id = activePageId.id;

    function addhttp(url) {
      if (!/^(?:f|ht)tps?\:\/\//.test(url)) {
        url = "http://" + url;
      }
      return url;
    }
    const valueNew = addhttp(inputFile.name)
    // var prefix = 'http://';
    let image_url = valueNew
    // console.log("img",image_url)
    let pdfData = await axios.post(`${process.env.REACT_APP_API_URL}/api/v1/files/add_banner_files`, {
      user_id,
      user_role,
      landing_image,
      image_url,
      page_url_check,
      page_id
    })
    return pdfData
  }
  const handleSubmit = () => {
    addFileData({ fileData, inputFile }).then(resp => {
      // console.log(resp, "resssssssssssssss")
      notify("success")
      setIsHide(true)
      setInputFile({ name: "" })
      // setInputFile({files:""})
      getBannerApi().then(resp => {
        setBannerList(resp.data.data)
      })
    }).catch(error => {
      console.log("error", error)
    })
  }

  const handleInput = (e) => {
    let text = { ...inputFile, name: e.target.value }
    setInputFile(text)
    if (isHide) {
      let text = { ...inputFile, name: "" }
      setInputFile(text)
    }
  }

  const handleLink = (text) => {
    // console.log("teeeeeeeee", text)
    window.open(
      `${text.image_url}`);
    // window.location.href = text.image_url;
  }

  const [isPrefilledTopic, setIsPrefilledTopic] = useState(false);
  // const [customPageUrlArray,setCustomPageUrlArray]=useState([])

  // hold the selected value of topics in dropdown
  const handleMultipleDropdown = (value) => {
    // console.log('valeue', value)
    setSelectedTopicValue(value);
    setPreCheckedTopic(value);
    if (value.length === 0) {
      setIsPrefilledTopic(false)
    } else {
    }
  }

  // submit selected option in promotion page
  const submitSelectedTopics = (event) => {
    let customUrlArray = [],
      page_id = [];
    customUrlArray.push(activePageId.page_route);
    page_id.push(activePageId.id);
    let page_url_check = customUrlArray;
    updateData(selectedTopicValue, page_url_check).then(resp => {
      // console.log(resp, "reeeeeeeee")
      getUpdateTopicList(selectedTopicValue, page_url_check, page_id)
    }).catch(error => {
      console.log(error, "errroor")
    })
  }

  // submit selected option in promotion page
  const removeSelectedTopics = (event) => {
    let page_url_check = activePageId.page_route;
    let page_id = [];
    page_id.push(activePageId.id);
    deleteTopicData(selectedTopicValue, page_url_check).then(resp => {
      // console.log(resp, "reeeeeeeee")
      getUpdateRemovedTopicList(selectedTopicValue, page_url_check, page_id)
      // getTopicsList();
    }).catch(error => {
      console.log(error, "errroor")
    })
  }

  const getUpdateTopicList = (selectedTopicValue, page_url_check, page_id) => {
    updateTopicRoute(selectedTopicValue, page_url_check, page_id).then(resp => {
      // console.log(resp, "reeeeeeeee")
      topicToastMessage('success','Topics Saved Successfully')
      getTopicsList();
    }).catch(error => {
      console.log(error, "errroor")
      topicToastMessage('error','Something went wrong')
    })
  }

  const getUpdateRemovedTopicList = (selectedTopicValue, page_url_check, page_id) => {
    deleteTopicRoute(selectedTopicValue, page_url_check, page_id).then(resp => {
      // console.log(resp, "reeeeeeeee")
      topicToastMessage('success','Topics Removed Successfully')
      getTopicsList();
    }).catch(error => {
      console.log(error, "errroor")
      topicToastMessage('error','Something went wrong')
    })
  }
// showing toast message when topic added or removed
  function topicToastMessage(status,message){
    if (status == "error") {
   return toast.error(message)
    } else if (status == "success") {
   return toast.success(message)
    } else if (status == "netork") {
     return toast.network("Network error Please check again")
    }
  }

  const [preCheckedTopics, setPreCheckedTopic] = useState([]);

  function setPrecheckedValue() {
    let idArray = [];
    if (getDataField) {
      // for (let i = 0; i < getDataField.length; i++) {
      //   if (getDataField[i].is_check_topic) {
      //     idArray.push(getDataField[i].id);
      //   } else {
      //   }
      // }
      // console.log('setPrecheckedValue',getDataField)
      for (let i = 0; i < getDataField.length; i++) {
        if (getDataField[i].is_check_topic) {
          debugger
          if (getDataField[i].page_id.length) {
            debugger
            for (let x = 0; x < getDataField[i].page_id.length; x++) {
              // console.log('getDataField[i].page_id', getDataField[i].page_id)
              if (getDataField[i].page_id[x] === activePageId.id) {
                idArray.push(getDataField[i].id);
              }
            }
          }
        } else {
        }
      }
      idArray = idArray.filter(function (item, index, inputArray) {
        return inputArray.indexOf(item) == index;
      });
      setPreCheckedTopic(idArray);
      setSelectedTopicValue(idArray);
      if (idArray.length) {
        setIsPrefilledTopic(true)
      } else {
        setIsPrefilledTopic(false)
      }
    }
  }

  useEffect(() => {
    // setPrecheckedValue()
  }, [getDataField])
  // console.log("bannerList", bannerList)

  const getData = async () => {
    let Data = await axios.post(`${process.env.REACT_APP_API_URL}/api/v1/files/get_page`)
    return Data
  }

  useEffect(() => {
    getData().then(resp => {
      // console.log(resp, "reeeeeeeeeeeee")
      if (resp.status == 200) {
        setGetValue(resp.data.data)
      }
    }).catch(error => {
      console.log(error, "errrrrrrrrrrrr")
    })
  }, []);
  // console.log("getttttttttttt", getValue)

  // const [activePageName,setActivePageName]=useState('default');
  // saving page id 
  const savePageId = (pageData) => {
    if (pageData) {
      setActivePageId(pageData)
    } else {
      setActivePageId({ id: 0, page_route: "default" })
    }
    setSearchString('');
    setShowPromoted(true);
    setInputFile({ files: [], name: "" });
    setIsHide(false);
    setFileData([]);
  }

  useEffect(() => {
    customPageBannerApi();
    getTopicsList();
    refetchPathway();
    refetchOffer();
    refetchProvider();
  }, [activePageId])

  // calling banner image api
  const customPageBannerApi = () => {
    getBannerApi().then(resp => {
      setBannerList(resp.data.data)
    }).catch(error => {
      console.log(error, "error")
    })
  }

  // console.log('\nshowData', showData)
  return (
    <Layout className="bg-transparent h-auto">
      <div className="default_home">
        <Button className={activePageId.id == 0 ? "selected_btn" : null} onClick={() => savePageId('')}>Default Home</Button>
      </div>
      <div className="default_link">
        {getValue && getValue.length ? getValue.map(item => {
          let newItem = item.page_route.split('/')
          let data = {
            id: item.id,
            page_route: item.page_route,
            split_route: newItem[newItem.length - 1]
          }
          return (
            <Button className={activePageId.id === data.id ? "selected_btn" : null} onClick={() => savePageId(data)}><p>{data.split_route}</p></Button>)
        }) : "NO CUSTOM PAGE FOUND"}
      </div>
      <LogOutTopbar>
        <SearchHeader title="PROMOTIONS" onSearch={handleDataSearch} onChange={handleOnChange}>
          <Popover content={filterContent} trigger="click">
            <Button className="rounded ml-1 px-4 text-center" type="primary" size="small">
              <FontAwesomeIcon className="text-white text-xs" icon={faFilter} />
            </Button>
          </Popover>
        </SearchHeader>
      </LogOutTopbar>
      <Content className="p-6">
        <TitleDivider
          title="Choose Topic"
          styles={{
            leftContainer: {
              backgroundColor: '#4a5568',
            },
            rightContainer: {
              backgroundColor: '#4a5568',
            },
          }}
        />
        <Select mode="multiple"
          allowClear
          className="w-full custom-select ml-1"
          value={selectedTopicValue}
          // defaultValue={preCheckedTopics}
          onChange={handleMultipleDropdown}
          showSearch>
          {preloadOptions(getDataField)}
        </Select>
        {selectedTopicValue.length ? <Button type="primary" size="small" className="rounded ml-1 px-4 text-center change_topic_btn" onClick={submitSelectedTopics}>Submit</Button> : ''}
        {isPrefilledTopic ? <Button type="primary" size="small" className="rounded ml-1 px-4 text-center change_topic_btn" onClick={removeSelectedTopics}>Remove</Button> : ''}
        <TitleDivider
          title="My Promotions"
          styles={{
            leftContainer: {
              backgroundColor: '#4a5568',
            },
            rightContainer: {
              backgroundColor: '#4a5568',
            },
          }}
        />
        <div className="shadow-md rounded-md w-full bg-white h-full pt-4 px-5 flex flex-wrap mb-1">
          {(showData.length &&
            showData
              .filter(function ({
                // main_promoted_by_user_ids,
                // local_promoted_by_user_ids,
                custom_page_promo_ids, custom_page_local_ids
              }) {
                return (
                  custom_page_promo_ids && custom_page_promo_ids.length ? custom_page_promo_ids.includes(activePageId.id) : false || custom_page_local_ids && custom_page_local_ids.length ? custom_page_local_ids.includes(activePageId.id) : false
                  // main_promoted_by_user_ids && main_promoted_by_user_ids.length ? main_promoted_by_user_ids.includes(adminId): false ||
                  // local_promoted_by_user_ids && local_promoted_by_user_ids.length ? local_promoted_by_user_ids.includes(adminId): false
                );
              })
              .map((d, index) => {
                return <PromoteCard key={index} data={d} session={session} activePageId={activePageId} type="selected" allApiCall={() => allApiCall()} />;
              })) || <Empty className="m-auto" />}
        </div>

        {/* <div className="shadow-md rounded-md w-full bg-white h-full pt-4 px-5 flex flex-wrap mb-1">
          {(showData.length &&
            showData
              .filter(function ({
                main_promoted_by_user_ids,
                local_promoted_by_user_ids,
              }) {
                return (
                  main_promoted_by_user_ids && main_promoted_by_user_ids.length ? main_promoted_by_user_ids.includes(adminId) : false ||
                    local_promoted_by_user_ids && local_promoted_by_user_ids.length ? local_promoted_by_user_ids.includes(adminId) : false
                );
              })
              .map((d, index) => {
                return <PromoteCard key={index} data={d} session={session} activePageId={activePageId} type="selected"/>;
              })) || <Empty className="m-auto" />}
        </div> */}
        <TitleDivider
          title="Other Promotions	&amp; Search Results"
          styles={{
            leftContainer: {
              backgroundColor: '#4a5568',
            },
            rightContainer: {
              backgroundColor: '#4a5568',
            },
          }}
        />
        <main className="shadow-md rounded-md w-full bg-white h-full pt-4 px-5 flex flex-wrap">
          {(showData.length &&
            showData.map((d, index) => {
              return <PromoteCard key={index} data={d} session={session} activePageId={activePageId} type="search" allApiCall={() => allApiCall()} />;
            })) || <Empty className="m-auto" />}
        </main>
        <TitleDivider
          title="Landing Page Image"
          styles={{
            leftContainer: {
              backgroundColor: '#4a5568',
            },
            rightContainer: {
              backgroundColor: '#4a5568',
            },
          }}
        />
        <Layout className="h-auto mb-6 opportunity_choose">
          <Col className="landing_page_image">
            <p>Landing Page Image</p>
            <div className='file-input'>
              <input multiple type='file' name="file" onChange={(e) => onChangeUpload(e, "files")} accept="image/*,video/*" />
              <span class='button'>Choose</span>
              <span class='label' data-js-label style={{ display: "none" }}></span>
            </div>
            <input className="landing_browse" placeholder={isHide ? inputFile.name : "Please Enter URL"} onChange={(e) => handleInput(e)} value={inputFile?.name}></input>
            <div className="image_block_opportunity">
              {fileData && fileData.length > 0 ? fileData.map((item, i) => {
                return (
                  <img src={item.original} alt={""} />
                )
              }) : null}
            </div>
            <div className="submit_btn">
              <button onClick={() => handleSubmit()}>Submit</button>
            </div>
          </Col>
        </Layout>
        <Table
          ref={bannerList}
          // loading={loading}
          pagination={{ pageSize: 8 }}
          dataSource={bannerList}
          bordered
          className="ant-table-wrapper--responsive"
          rowClassName={() => 'antd-row'}
          rowKey="id"
        >
          <Column
            className="antd-col"
            title="Listing"
            dataIndex="image_url"
            key="image_url"
            render={(text, record) => ({
              children: text,
              props: {
                'image_url': 'image_url',
              },
            })}
          />
          <Column
            className="antd-col"
            // title="pdf_link"
            key="image_url"
            render={(text, record, index) => ({
              children: (
                <Button
                  onClick={() => handleLink(text)}
                  title="PDF Listing"
                  dataIndex="original"
                  key="image_url"
                  render={(text, record) => ({
                    children: text,
                    props: {
                      'image_url': 'image_url',
                    },
                  })}
                >click here</Button>
              ),
              props: {
                'image_url': 'image_url',
              },
            })}
          />
        </Table>
      </Content>
    </Layout>
  );
}