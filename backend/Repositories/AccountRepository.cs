using MovieReviewApp.backend.Models;
using MovieReviewApp.backend.Data;
using Microsoft.EntityFrameworkCore;
using System.Diagnostics.CodeAnalysis;
using backend.DTOs;
namespace MovieReviewApp.backend.Repositories
{
    public class AccountRepository : GenericRepository<Account>
    {
        public AccountRepository(AppDbContext context) : base(context)
        {
        }

        public  async Task<Account> GetByIdAsyncExceptDeleted(int id)
        {
            var account = await _context.Set<Account>()
            .Where(a => a.Id == id && !a.isDeleted)
            .FirstOrDefaultAsync();
            return account;
        }

        public override async Task DeleteAsync(int id)
        {
            var entity = await GetByIdAsync(id);
            if (entity != null)
            {
                entity.isDeleted = true;
                _context.Entry(entity).State = EntityState.Modified;
                await _context.SaveChangesAsync();
            }
        }


        public override async Task UpdateAsync(Account entity)
        {
            var existingUser = await GetByIdAsync(entity.Id);
            if (existingUser == null)
            {
                throw new KeyNotFoundException($"User with id {entity.Id} not found");
            }
             _context.Entry(existingUser).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }

        public async Task<Account?> GetInfoLoginAsync(LoginDTO loginRequestDto)
        {
            var account = await _context.Set<Account>()
                .Include(a => a.User)
                .FirstOrDefaultAsync(u => u.Username == loginRequestDto.Username && u.PasswordHash == loginRequestDto.Password && !u.isDeleted);
            return account;
        }

        public async Task<bool> ValidateLoginAsync(string username, string passwordHash)
        {
            var isValid = await _context.Set<Account>()
                .AnyAsync(a => a.Username == username 
                            && a.PasswordHash == passwordHash 
                            && !a.isDeleted);
            return isValid;
        }


        public async Task<PaginatedResponse<AccountAdminDTO>> GetFilmAdminWithPagination(int pageNumber, int pageSize, string? searchKeyword)
        {
            // IQueryable không thực thi ngay, nó chỉ xây dựng câu lệnh SQL
            var query = _context.Set<Account>()
                // Thêm kiểm tra an toàn cho Title = null
                .Where(f => string.IsNullOrEmpty(searchKeyword)
                            || (f.Username != null && f.Username.Contains(searchKeyword)));
            var totalRecords = await query.CountAsync();
            // Thực thi truy vấn với phân trang và chuyển đổi sang DTO
            var AccountAdminDTO = await query
            // 1. Join với bảng Director
                .Skip((pageNumber - 1) * pageSize)
                .Include(f => f.User)
                .Take(pageSize)
                // 2. Chuyển đổi sang DTO
                .Select(f => new AccountAdminDTO
                {
                    Id = f.Id,
                    UserId = f.UserId,
                    UserName = f.Username,
                    Role = f.Role,
                    isDeleted = f.isDeleted
                })
                 .ToListAsync();
            return new PaginatedResponse<AccountAdminDTO>
            {
                Data = AccountAdminDTO,
                TotalPages = (int)Math.Ceiling((double)totalRecords / pageSize),
                CurrentPage = pageNumber
            };
        }

        public async Task<List<AccountUserDTO>> getAllUser()
        {
            var users = await _context.Set<User>()
                .Where(a => !a.isDeleted)
                .Select(a => new AccountUserDTO
                {
                    UserId = a.Id,
                    UserName = a.FullName
                })
                .ToListAsync();
            return users;
        }

        public async Task UpdateAccount(int id, AccountAdminDTO account)
        {
            var existingAccount = await GetByIdAsync(id);
            if (existingAccount == null)
            {
                throw new KeyNotFoundException($"Account with id {id} not found");
            }

            // Cập nhật các thuộc tính từ DTO vào entity
            existingAccount.Username = account.UserName;
            existingAccount.Role = account.Role;
            existingAccount.isDeleted = account.isDeleted;
            existingAccount.PasswordHash = "123456789"; // Đặt mật khẩu mặc định hoặc từ DTO nếu có
            _context.Entry(existingAccount).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }

        public async Task CreateAccount(AccountAdminDTO account)
        {
            var newAccount = new Account
            {
                UserId = account.UserId,
                Username = account.UserName,
                Role = account.Role,
                isDeleted = account.isDeleted,
                PasswordHash = "123456789" // Đặt mật khẩu mặc định hoặc từ DTO nếu có
            };
            await _context.Set<Account>().AddAsync(newAccount);
            await _context.SaveChangesAsync();
        }

        // Lấy danh sách người dùng chưa có tài khoản
        public async Task<List<AccountUserDTO>> GetUsersWithoutAccountsAsync()
        {
            var usersWithAccounts = await _context.Set<Account>()
                .Select(a => a.UserId)
                .ToListAsync();

            var usersWithoutAccounts = await _context.Set<User>()
                .Where(u => !usersWithAccounts.Contains(u.Id) && !u.isDeleted)
                .Select(u => new AccountUserDTO
                {
                    UserId = u.Id,
                    UserName = u.FullName
                })
                .ToListAsync();

            return usersWithoutAccounts;
        }
    }

}