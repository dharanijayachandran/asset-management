import { APP_BASE_HREF } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AssetAccessComponent } from './asset access/pages/asset-access/asset-access.component';
import { AlarmConfigListComponent } from './asset-template/pages/alarm-config-list/alarm-config-list.component';
import { AnalogTagFormViewComponent } from './asset-template/pages/analog-tag-form-view/analog-tag-form-view.component';
import { AnalogTagListComponent } from './asset-template/pages/analog-tag-list/analog-tag-list.component';
import { AnalogTagPreviewComponent } from './asset-template/pages/analog-tag-preview/analog-tag-preview.component';
import { AnalogTagReadViewComponent } from './asset-template/pages/analog-tag-read-view/analog-tag-read-view.component';
import { AnalogTagViewComponent } from './asset-template/pages/analog-tag-view/analog-tag-view.component';
import { AssetInputOutputComponent } from './asset-template/pages/asset-input-output/asset-input-output.component';
import { AssetTemplateFormViewComponent } from './asset-template/pages/asset-template-form-view/asset-template-form-view.component';
import { AssetTemplateListComponent } from './asset-template/pages/asset-template-list/asset-template-list.component';
import { AssetTemplatePreviewComponent } from './asset-template/pages/asset-template-preview/asset-template-preview.component';
import { AssetTemplateReadViewComponent } from './asset-template/pages/asset-template-read-view/asset-template-read-view.component';
import { AssetTemplateViewComponent } from './asset-template/pages/asset-template-view/asset-template-view.component';
import { AssetTemplateComponent } from './asset-template/pages/asset-template/asset-template.component';
import { DiscreteTagFormComponent } from './asset-template/pages/discrete-tag-form/discrete-tag-form.component';
import { DiscreteTagListComponent } from './asset-template/pages/discrete-tag-list/discrete-tag-list.component';
import { DiscreteTagPreviewComponent } from './asset-template/pages/discrete-tag-preview/discrete-tag-preview.component';
import { DiscreteTagReadViewComponent } from './asset-template/pages/discrete-tag-read-view/discrete-tag-read-view.component';
import { DiscreteTagViewComponent } from './asset-template/pages/discrete-tag-view/discrete-tag-view.component';
import { GenerateAssetTagComponent } from './asset-template/pages/generate-asset-tag/generate-asset-tag.component';
import { ManageAlarmAnalogAssetTagListComponent } from './asset-template/pages/manage-alarm-analog-asset-tag-list/manage-alarm-analog-asset-tag-list.component';
import { ManageAlarmAnalogAssetTagComponent } from './asset-template/pages/manage-alarm-analog-asset-tag/manage-alarm-analog-asset-tag.component';
import { ManageAlarmDiscreteAssetTagListComponent } from './asset-template/pages/manage-alarm-discrete-asset-tag-list/manage-alarm-discrete-asset-tag-list.component';
import { ManageAlarmDiscreteAssetTagComponent } from './asset-template/pages/manage-alarm-discrete-asset-tag/manage-alarm-discrete-asset-tag.component';
import { ManageAssetTagComponent } from './asset-template/pages/manage-asset-tag/manage-asset-tag.component';
import { ManageDiscreteAssetTagIoPreviewComponent } from './asset-template/pages/manage-discrete-asset-tag-io-preview/manage-discrete-asset-tag-io-preview.component';
import { ManageDiscreteAssetTagIoReadViewComponent } from './asset-template/pages/manage-discrete-asset-tag-io-read-view/manage-discrete-asset-tag-io-read-view.component';
import { ManageDiscreteAssetTagIoComponent } from './asset-template/pages/manage-discrete-asset-tag-io/manage-discrete-asset-tag-io.component';
import { AssetFormViewComponent } from './asset/pages/asset-form-view/asset-form-view.component';
import { AssetListComponent } from './asset/pages/asset-list/asset-list.component';
import { AssetPreviewComponent } from './asset/pages/asset-preview/asset-preview.component';
import { AssetReadViewComponent } from './asset/pages/asset-read-view/asset-read-view.component';
import { AssetViewComponent } from './asset/pages/asset-view/asset-view.component';
import { DownloadAssetTagsComponent } from './asset/pages/download-asset-tags/download-asset-tags.component';


const routes: Routes = [
  {
    path: 'asset-template',
    children: [
      {
        path: '',
        component: AssetTemplateComponent
      },
    ]
  },
  {
    path: 'asset',
    children: [
      {
        'path': '',
        component: AssetListComponent
      }
    ]
  },
  {
    path: 'asset-access',
    children: [
      {
        path: '',
        component: AssetAccessComponent,
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [
    { provide: APP_BASE_HREF, useValue: '/asset-config' },
  ],
})
export class AppRoutingModule {

 }
 export const assetRoutingComponent = [
  AssetTemplateComponent,
  AssetTemplateListComponent,
  AssetTemplateFormViewComponent,
  AssetTemplateViewComponent,
  AssetTemplatePreviewComponent,
  GenerateAssetTagComponent,
  AssetTemplateReadViewComponent,
  ManageAssetTagComponent,
  AnalogTagListComponent,
  AnalogTagFormViewComponent,
  AnalogTagPreviewComponent,
  AnalogTagViewComponent,
  AnalogTagReadViewComponent,
  AssetInputOutputComponent,
  AssetFormViewComponent,
  AssetPreviewComponent,
  AssetReadViewComponent,
  AssetViewComponent,
  AssetListComponent,
  DiscreteTagListComponent,
  DiscreteTagFormComponent,
  DiscreteTagPreviewComponent,
  DiscreteTagReadViewComponent,
  DiscreteTagViewComponent,
  ManageDiscreteAssetTagIoComponent,
  ManageDiscreteAssetTagIoPreviewComponent,
  ManageDiscreteAssetTagIoReadViewComponent,
  ManageAlarmAnalogAssetTagComponent,
  ManageAlarmDiscreteAssetTagComponent,
  ManageAlarmAnalogAssetTagListComponent,
  ManageAlarmDiscreteAssetTagListComponent,
  AssetAccessComponent,
  DownloadAssetTagsComponent,
  AlarmConfigListComponent
];
