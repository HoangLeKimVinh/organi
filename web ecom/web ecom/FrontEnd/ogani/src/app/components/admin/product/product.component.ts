import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CategoryService } from 'src/app/_service/category.service';
import { ImageService } from 'src/app/_service/image.service';
import { ProductService } from 'src/app/_service/product.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
  providers: [MessageService,ConfirmationService]

})
export class ProductComponent implements OnInit {

  listProduct: any;
  listCategory: any;
  listImage: any;

  disabled : boolean = true;



  selectedFiles ?: FileList;
  currentFile ?: File;

  listImageChoosen : any = [];
  selectedImages: any[] = [];
  imageChoosen : any;

  onUpdate : boolean =false;
  showForm : boolean = false;
  showImage: boolean = false;
  showDelete: boolean = false;

  productForm: any ={
    name : null,
    description : null,
    price: null,
    quantity: null,
    categoryId: null,
    imageIds: []
  };

  constructor(private messageService: MessageService,private productService: ProductService,private imageService: ImageService,private categoryService:CategoryService){

  }

  ngOnInit(): void {
    this.getListProduct();
    this.getListCategoryEnabled();
    this.getListImage();
  }


  openNew() {
    this.onUpdate = false;
    this.showForm = true;
    this.listImageChoosen = [];
    this.selectedImages = [];
    this.productForm ={
      id:null,
      name: null,
      description : null,
      price: null,
      quantity: null,
      categoryId: null,
      imageIds: []
    }
  }

  openUpdate(data: any) {
    this.listImageChoosen = [];
    this.onUpdate = true;
    this.showForm = true;
    this.productForm.id = data.id;
    this.productForm.name = data.name;
    this.productForm.description = data.description;
    this.productForm.price = data.price;
    this.productForm.quantity = data.quantity;
    this.productForm.categoryId = data.category.id;

    // Iterate through the list of all images
    this.listImage.forEach((img: any) => {
      // Check if the current image is among the selected images for the product being updated
      const isSelected = data.images.some((selectedImage: any) => selectedImage.id === img.id);
      // Clone the image object and set the 'selected' property accordingly
      const imgCopy = { ...img, selected: isSelected };
      // If the image is selected, add it to the list of chosen images
      if (isSelected) {
        this.listImageChoosen.push(imgCopy);
      }
    });

    // Ensure that selectedImages is updated to reflect the initially selected images
    this.selectedImages = [...this.listImageChoosen];
  }

  onChooseImage() {
    this.showImage = true;
    this.disabled = true;

    // Khôi phục lại trạng thái của các ảnh đã chọn trước đó
    this.listImage.forEach((img:any) => {
      img.selected = this.selectedImages.some(selectedImage => selectedImage.id === img.id);
    });
  }

// ...

// Add a function to determine if an image is selected
  isImageSelected(image: any): boolean {
    return this.selectedImages.some((selectedImage: any) => selectedImage.id === image.id);
  }


  getListProduct(){
    this.productService.getListProduct().subscribe({
      next: res =>{
        this.listProduct =res;
        console.log(this.listProduct)
      },error: err=>{
        console.log(err);
      }
    })
  }

  getListCategoryEnabled(){
    this.categoryService.getListCategoryEnabled().subscribe({
      next: res =>{
        this.listCategory = res;
      },error : err=>{
        console.log(err);
      }
    })
  }

  getListImage(){
    this.imageService.getList().subscribe({
      next:res=>{
        this.listImage = res;
      },error: err=>{
        console.log(err);
      }
    })
  }

  // uploadFile(event: any){
  //   this.selectedFiles = event.target.files;
  //   if(this.selectedFiles){
  //     const file: File | null = this.selectedFiles.item(0);
  //     if(file){
  //       this.currentFile = file;
  //       this.imageService.upload(this.currentFile).subscribe({
  //         next: res =>{
  //           this.currentFile = undefined;
  //           this.getListImage();
  //         },error: err=>{
  //         }
  //       })
  //     }
  //     this.currentFile = undefined;
  //   }
  // }

  uploadFile(event: any) {
    this.selectedFiles = event.target.files;
    if (this.selectedFiles && this.selectedFiles.length > 0) {
      for (let i = 0; i < this.selectedFiles.length; i++) {
        const file: File | null = this.selectedFiles.item(i);
        if (file) {
          this.currentFile = file;
          this.imageService.upload(this.currentFile).subscribe({
            next: res => {
              this.currentFile = undefined;
              this.getListImage();
            },
            error: err => {
              this.showError(err.message);
            }
          });
        }
        this.currentFile = undefined;
      }
    }
  }



  createProduct(){
    let data = this.listImageChoosen;
    data.forEach((res: any)=>{
      this.productForm.imageIds.push(res.id);
    })
    const {name,description,price,quantity,categoryId,imageIds} = this.productForm;
    console.log(this.productForm);
    this.productService.createProduct(name,description,price,quantity,categoryId,imageIds).subscribe({
      next: res =>{
        this.getListProduct();
        this.showForm = false;
        this.showSuccess("Thêm mới thành công");

      },error: err =>{
        this.showError(err.message);
      }
    })
  }

  updateProduct(){
    let data = this.listImageChoosen;
    data.forEach((res: any)=>{
      this.productForm.imageIds.push(res.id);
    })
    const {id,name,description,price,quantity,categoryId,imageIds} = this.productForm;
    console.log(this.productForm);
    this.productService.updateProduct(id,name,description,price,quantity,categoryId,imageIds).subscribe({
      next: res =>{
        this.getListProduct();
        this.showForm = false;
        this.showSuccess("Cập nhật thành công");
      },error: err =>{
        this.showError(err.message);
      }
    })

  }

  onDelete(id: number,name: string){
    this.productForm.id = null;
    this.showDelete = true;
    this.productForm.id = id;
    this.productForm.name = name;
  }

  deleteProduct(){
    this.productService.deleteProduct(this.productForm.id).subscribe({
      next: res =>{
        this.getListProduct();
        this.showWarn("Xóa thành công");
        this.showDelete = false;
      },error: err =>{
        this.showError(err.message);
      }
    })
  }

  chooseImage() {
    this.listImageChoosen = [...this.selectedImages];
    console.log(this.listImageChoosen);
    this.showImage = false;
  }

  selectImage(event: any, image: any) {
    const selectedImageIndex = this.selectedImages.findIndex(selectedImage => selectedImage.id === image.id);

    if (selectedImageIndex === -1) {
      this.selectedImages.push(image);
    } else {
      this.selectedImages.splice(selectedImageIndex, 1);
    }

    // Cập nhật trạng thái dấu tick cho từng ảnh
    this.listImage.forEach((img:any) => {
      img.selected = this.selectedImages.some(selectedImage => selectedImage.id === img.id);
    });

    this.disabled = this.selectedImages.length === 0;
  }

  clearSelectedImages() {
    this.selectedImages = [];
    this.listImage.forEach((img:any) => {
      img.selected = false;
    });
    this.disabled = true;
  }

showSuccess(text: string) {
  this.messageService.add({severity:'success', summary: 'Success', detail: text});
}
showError(text: string) {
  this.messageService.add({severity:'error', summary: 'Error', detail: text});
}

showWarn(text : string) {
  this.messageService.add({severity:'warn', summary: 'Warn', detail: text});
}

}
