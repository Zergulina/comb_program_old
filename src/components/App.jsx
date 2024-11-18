import MainNav from "./MainNav"
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import UserPage from "./pages/User/UserPage";
import ExpertPage from "./pages/Expert/ExpertPage";
import React, { useState, useEffect } from "react";
import FileService from "../Services/FileService";
import InnerUserNav from "./InnerUserNav";
import InnerExpertNav from "./InnerExpertNav";
import ExpertCropsPage from "./pages/ExpertCrops/ExpertCropsPage";
import CropsPage from "./pages/Crops/CropsPage";
import UserCombPage from "./pages/UserComb/UserCombPage";
import ExpertTablePage from "./pages/ExpertTable/ExpertTablePage";
import ExpertParamsPage from "./pages/ExpertParams/ExpertParamsPage"

function App() {
  const [combFiles, setCombFiles] = useState([]);

  const [cropCards, setCropCards] = useState([]);

  const [data, setData] = useState({
      headers: {
        const: [],
        editable: []
      },
      values: []
  })

  useEffect(() => {

    FileService.initJsonFiles(setCombFiles);

    return (() => {

    })
  }, [])

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<MainNav />}>
          <Route index element={
            <UserPage files={combFiles} />
          } />
          <Route path="/expert" element={
            <ExpertPage combFiles={combFiles} setCombFiles={setCombFiles} />
          } />
        </Route>
        {
          combFiles.map(file =>
            <Route path={`/:combTitle`} element={<InnerUserNav BackLinkTo={'/'} />} key={file.title}>
              <Route index element={<CropsPage cropCards={cropCards} setCropCards={setCropCards} />} />
            </Route>
          )}
        {
          combFiles.map(file =>
            <Route path={`/expert/:combTitle`} element={<InnerUserNav BackLinkTo={'/expert'} />} key={file.title}>
              <Route index element={<ExpertCropsPage cropCards={cropCards} setCropCards={setCropCards} />} />
            </Route>
          )}
        {
          cropCards.map(crop =>
            <Route path={`/:combTitle/:cropTitle`} element={<InnerUserNav BackLinkTo={'/'} />} key={crop.title}>
              <Route index element={<UserCombPage data={data} setData={setData} />} />
            </Route>
          )}
        {
          cropCards.map(crop =>
            <Route path={`/expert/:combTitle/:cropTitle`} element={<InnerExpertNav />} key={crop.title}>
              <Route index element={<ExpertTablePage data={data} setData={setData} />} />
              <Route path={`/expert/:combTitle/:cropTitle/params`} element={<ExpertParamsPage data={data} setData={setData} />} />
            </Route>
          )}
      </Routes>
    </BrowserRouter>

  );
}

export default App;
