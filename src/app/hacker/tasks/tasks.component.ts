import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ColumnsModel, CardSettingsModel, SwimlaneSettingsModel, DialogSettingsModel, KanbanComponent } from '@syncfusion/ej2-angular-kanban';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { HackerService } from 'src/app/core/_services/hacker.service';
import { constants } from 'src/app/core/_utils/const';
import LoadStatus from 'src/app/core/_utils/LoadStatus';
import { Query } from '@syncfusion/ej2-data';
import { forkJoin } from 'rxjs';
import { result } from 'lodash';
import { NotificationService } from 'src/app/core/_services/notification.service';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit {
  @ViewChild('kanbanObj') kanbanObj!: KanbanComponent;
  sideNavOpened = false;
  loadingTasks: LoadStatus = 'loading';
  tasks: any;
  taskColumns: ColumnsModel[] = [
    { headerText: 'Open', keyField: 'Open', allowToggle: true },
    { headerText: 'Completed', keyField: 'Completed', allowToggle: true }
  ];
  taskCardSettings: CardSettingsModel = {
    contentField: 'details',
    headerField: 'title',
    template: '#cardTemplate',
  };
  taskDialogSettings: DialogSettingsModel = {
    fields: [
      { text: 'Status', key: 'status', type: 'DropDown' },
      { text: 'Details', key: 'details', type: 'TextArea' },
    ]
  };
  taskSwimlaneSettings: SwimlaneSettingsModel = { keyField: 'projectId' };
  statusData = [
    { name: 'Open', value: 'Open' },
    { name: 'Completed', value: 'Completed' }
  ];
  tasksQuery = '';
  statusQuery = 'None';
  projects: any;
  minDate = '2022-01-01';

  constructor(
    public hackerService: HackerService,
    public oidcSecurityService: OidcSecurityService,
    public notifyService: NotificationService,
  ) {
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.loadingTasks = 'loading';

    forkJoin({
      userProfile: this.hackerService.getProfile(),
      getTasksResult: this.hackerService.getTasks(),
      requirementLevels: this.hackerService.getRequirementLevels(),
    }).subscribe({
      next: ({
        userProfile,
        getTasksResult,
        requirementLevels,
      }) => {
        this.formatTasks(getTasksResult.data);
        const level = requirementLevels?.find((i: any) => i.name.includes(userProfile.level));
        this.getProjects(level!.id);
      },
      error: () => (this.loadingTasks = 'error'),
    });
  }

  getProjects(level: number) {
    this.hackerService.getProjects({
      requirementLevelId: level
    }).subscribe({
      next: (result) => {
        this.projects = result.data;

        this.loadingTasks = 'success';
      },
      error: () => {
        this.loadingTasks = 'error';
      }
    })
  }

  refreshData() {
    this.hackerService.getTasks().subscribe({
      next:result => {
        this.formatTasks(result.data);
      },
      error:err => {
        // console.log(err);
      }
    })
  }

  formatTasks(data:any) {
    const resultConst = data;
    resultConst.forEach((element: any) => {
      if (element.isCompleted)
        element.status = constants.COMPLETED;
      else
        element.status = constants.OPEN;

      let date = new Date(element.dueDate);
      const offset = date.getTimezoneOffset();
      date = new Date(date.getTime() - (offset * 60 * 1000))
      element.dueDate = date.toISOString().split('T')[0];
    });
    this.tasks = resultConst;
  }

  toggleSideNav() {
    this.sideNavOpened = !this.sideNavOpened;
  }

  logout() {
    this.oidcSecurityService.logoff();
  }

  addNewTask(): void {
    const cardDetails = {
      title: '',
      details: '',
      projectId: undefined,
      hackerProjectId: undefined,
      hackerId: undefined,
      dueDate: undefined,
      isCompleted: false,
      status: 'Open'
    }

    this.kanbanObj.openDialog('Add', cardDetails);
  }

  onActionComplete(args: any) { 
    if(args.requestType === "cardCreated") {
      const value = args.addedRecords[0];

      const input = {
        title: value.title,
        details: value.details,
        projectId: value.projectId,
        dueDate: value.dueDate ? new Date(value.dueDate).toISOString() : new Date().toISOString(),
        isCompleted: value.status == constants.OPEN ? false : true
      }

      this.hackerService.createTask(input).subscribe({
        next:() => {
          this.notifyService.showSuccess('Task created', 'Hurray 🥳');
          this.refreshData();
        },
        error:err => {
          // console.log(err);
        }
      })
    }
    else if(args.requestType === "cardChanged") { 
      const value = args.changedRecords[0];
  
      const input = {
        id: value.id,
        title: value.title,
        details: value.details,
        projectId: value.projectId,
        hackerProjectId: value.hackerProjectId,
        hackerId: value.hackerId,
        dueDate: value.dueDate ? new Date(value.dueDate).toISOString() : new Date().toISOString(),
        isCompleted: value.status == constants.OPEN ? false : true,
      }
  
      this.hackerService.updateTask(input).subscribe({
        next:() => {
          if(input.isCompleted)
            this.notifyService.showSuccess('Task completed. You are a star 🌟', 'Hurray 🥳');
          
          this.refreshData();
        },
        error:err => {
          // console.log(err);
        }
      })
    }
    else if(args.requestType === "cardRemoved") { 
      const value = args.deletedRecords[0];
  
      this.hackerService.deleteTask(value.id).subscribe({
        next:() => {
          this.notifyService.showSuccess('Task deleted', 'Oops 😒');
          this.refreshData();
        },
        error:err => {
          // console.log(err);
        }
      })
    }
  }

  searchTasks(): void {
    let searchQuery: Query = new Query();
    if (this.tasksQuery)
      searchQuery = new Query().search(this.tasksQuery, ['title', 'details', 'dueDate'], 'contains', true);
    
    this.kanbanObj.query = searchQuery;
  }

  statusSelect(): void {
    let filterQuery: Query = new Query();
    if (this.statusQuery !== 'None')
      filterQuery = new Query().where('status', 'equal', this.statusQuery);
    
    this.kanbanObj.query = filterQuery;
  }

  resetFilters() {
    this.tasksQuery = '';
    this.statusQuery = 'None';
    this.searchTasks();
    this.statusSelect();
  }

}
