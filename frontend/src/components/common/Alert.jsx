import Swal from 'sweetalert2';
export const confirmDelete = (title, id, onDelete) => {
    const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger"
    },
    // buttonsStyling: false
    });
    swalWithBootstrapButtons.fire({
    title: "Bạn có chắc muốn xóa " + title + " ID: " + id + "?",
    text: "Không thể hoàn tác lại sau khi xóa!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Xóa",
    cancelButtonText: "Hủy",
    reverseButtons: true
    }).then((result) => {
    if (result.isConfirmed) {
        onDelete(id);
        swalWithBootstrapButtons.fire({
        title: "Deleted!",
        text: "Đã xóa thành công " + title + " ID: " + id,
        icon: "success"
        });
    } else if (
        /* Read more about handling dismissals below */
        result.dismiss === Swal.DismissReason.cancel
    ) {
        swalWithBootstrapButtons.fire({
        title: "Cancelled",
        text: "Hành động xóa đã bị hủy!",
        icon: "error"
        });
    }
    });
}

export const AlertSuccess = (message) => {
    Swal.fire({
        icon: 'success',
        title: message,
        draggable: true
    });
}

export const AlertError = () => {
    Swal.fire({
    icon: "error",
    title: "Oops...",
    text: "Something went wrong!",
    footer: '<a href="#">Why do I have this issue?</a>'
    });
}


